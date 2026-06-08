// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title AGROVIDA Presale
 * @notice Presale contract — acepta MATIC nativo y USDT (Polygon).
 *
 *  Tasas fijas definidas por el owner:
 *    • MATIC: 1 MATIC  = RATE_MATIC  tokens AGROVIDA  (default: 1 000)
 *    • USDT:  1 USDT   = RATE_USDT   tokens AGROVIDA  (default: 10)
 *      → precio implícito $0.10 / AGROVIDA (asumiendo MATIC ≈ $1 —
 *        el owner puede ajustar RATE_MATIC en cualquier momento)
 *
 *  Límites por transacción:
 *    • MATIC: mín 0.1 — máx 1 000
 *    • USDT:  mín 1   — máx 100 000
 *
 *  Cap global: 100 000 000 AGROVIDA (10 % del supply total)
 *
 *  Seguridad:
 *    • ReentrancyGuard en todas las funciones de estado
 *    • SafeERC20 para USDT (maneja tokens no estándar)
 *    • Pausable — owner puede pausar en emergencia
 *    • CEI pattern en todas las compras
 *    • Fondos (MATIC + USDT) retirables solo por owner
 */
contract Presale is ReentrancyGuard, Ownable, Pausable {
    using SafeERC20 for IERC20;

    // ─── Constantes ───────────────────────────────────────────────────────────
    uint256 public constant PRESALE_CAP = 100_000_000 * 10 ** 18; // 100M AGROVIDA

    // Límites MATIC
    uint256 public constant MIN_MATIC = 0.1  ether;
    uint256 public constant MAX_MATIC = 1_000 ether;

    // Límites USDT (6 decimales en Polygon)
    uint256 public constant MIN_USDT = 1   * 10 ** 6;
    uint256 public constant MAX_USDT = 100_000 * 10 ** 6;

    // ─── Estado ───────────────────────────────────────────────────────────────
    IERC20  public immutable agrovida;
    IERC20  public immutable usdt;

    /// @notice AGROVIDA entregados por 1 MATIC (18 decimales)
    uint256 public rateMatic;
    /// @notice AGROVIDA entregados por 1 USDT (6 decimales)
    uint256 public rateUsdt;

    uint256 public totalSold;      // AGROVIDA vendidos en total
    bool    public presaleOpen;

    mapping(address => uint256) public purchased; // AGROVIDA por dirección

    // ─── Eventos ──────────────────────────────────────────────────────────────
    event BoughtWithMatic(address indexed buyer, uint256 maticPaid, uint256 agroReceived);
    event BoughtWithUSDT (address indexed buyer, uint256 usdtPaid,  uint256 agroReceived);
    event RatesUpdated(uint256 newRateMatic, uint256 newRateUsdt);
    event MaticWithdrawn(address indexed to, uint256 amount);
    event UsdtWithdrawn (address indexed to, uint256 amount);
    event PresaleToggled(bool open);

    // ─── Constructor ──────────────────────────────────────────────────────────
    /**
     * @param _agrovida  Dirección del contrato AGROVIDA ERC-20
     * @param _usdt      Dirección de USDT en Polygon (0xc2132D05D31c914a87C6611C10748AEb04B58e8F)
     * @param _rateMatic AGROVIDA por 1 MATIC  (ej. 1000 → 1 MATIC = 1 000 AGROVIDA)
     * @param _rateUsdt  AGROVIDA por 1 USDT   (ej. 10   → 1 USDT  = 10  AGROVIDA)
     * @param _owner     Wallet dueña del contrato (recibe fondos, puede pausar)
     */
    constructor(
        address _agrovida,
        address _usdt,
        uint256 _rateMatic,
        uint256 _rateUsdt,
        address _owner
    ) Ownable(_owner) {
        require(_agrovida != address(0), "Presale: agrovida zero");
        require(_usdt     != address(0), "Presale: usdt zero");
        require(_rateMatic > 0,          "Presale: rateMatic zero");
        require(_rateUsdt  > 0,          "Presale: rateUsdt zero");

        agrovida  = IERC20(_agrovida);
        usdt      = IERC20(_usdt);
        rateMatic = _rateMatic;
        rateUsdt  = _rateUsdt;
    }

    // ─── Compra con MATIC ─────────────────────────────────────────────────────

    /**
     * @notice Compra AGROVIDA enviando MATIC nativo.
     * @dev    El valor enviado debe estar entre MIN_MATIC y MAX_MATIC.
     */
    function buyWithMatic() external payable nonReentrant whenNotPaused {
        require(presaleOpen, "Presale: cerrada");
        require(msg.value >= MIN_MATIC, "Presale: monto minimo 0.1 MATIC");
        require(msg.value <= MAX_MATIC, "Presale: monto maximo 1000 MATIC");

        // AGROVIDA = MATIC_enviado * rateMatic
        // msg.value tiene 18 decimales, rateMatic es AGROVIDA por 1 MATIC
        uint256 agroAmount = (msg.value * rateMatic * 10 ** 18) / 1 ether;

        _deliverTokens(msg.sender, agroAmount);
        emit BoughtWithMatic(msg.sender, msg.value, agroAmount);
    }

    // ─── Compra con USDT ──────────────────────────────────────────────────────

    /**
     * @notice Compra AGROVIDA con USDT.
     * @dev    El comprador debe haber aprobado este contrato antes:
     *         usdt.approve(presaleAddress, usdtAmount)
     * @param usdtAmount Cantidad de USDT a pagar (6 decimales).
     */
    function buyWithUSDT(uint256 usdtAmount) external nonReentrant whenNotPaused {
        require(presaleOpen,              "Presale: cerrada");
        require(usdtAmount >= MIN_USDT,   "Presale: minimo 1 USDT");
        require(usdtAmount <= MAX_USDT,   "Presale: maximo 100000 USDT");

        // AGROVIDA = (usdtAmount / 10^6) * rateUsdt * 10^18
        uint256 agroAmount = (usdtAmount * rateUsdt * 10 ** 18) / 10 ** 6;

        // Tomar USDT del comprador (requiere approve previo)
        usdt.safeTransferFrom(msg.sender, address(this), usdtAmount);

        _deliverTokens(msg.sender, agroAmount);
        emit BoughtWithUSDT(msg.sender, usdtAmount, agroAmount);
    }

    // ─── Internals ────────────────────────────────────────────────────────────

    function _deliverTokens(address buyer, uint256 agroAmount) internal {
        require(agroAmount > 0, "Presale: cantidad cero");
        require(totalSold + agroAmount <= PRESALE_CAP, "Presale: cap alcanzado");
        require(
            agrovida.balanceOf(address(this)) >= agroAmount,
            "Presale: sin liquidez"
        );

        totalSold          += agroAmount;
        purchased[buyer]   += agroAmount;

        agrovida.safeTransfer(buyer, agroAmount);
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    /// @notice Abrir o cerrar la presale.
    function setPresaleOpen(bool _open) external onlyOwner {
        presaleOpen = _open;
        emit PresaleToggled(_open);
    }

    /// @notice Actualizar tasas de cambio.
    function setRates(uint256 _rateMatic, uint256 _rateUsdt) external onlyOwner {
        require(_rateMatic > 0 && _rateUsdt > 0, "Presale: rate cero");
        rateMatic = _rateMatic;
        rateUsdt  = _rateUsdt;
        emit RatesUpdated(_rateMatic, _rateUsdt);
    }

    /// @notice Retirar MATIC acumulado.
    function withdrawMatic(address payable to) external onlyOwner nonReentrant {
        require(to != address(0), "Presale: zero address");
        uint256 bal = address(this).balance;
        require(bal > 0, "Presale: sin MATIC");
        (bool ok, ) = to.call{value: bal}("");
        require(ok, "Presale: transfer MATIC fallo");
        emit MaticWithdrawn(to, bal);
    }

    /// @notice Retirar USDT acumulado.
    function withdrawUSDT(address to) external onlyOwner nonReentrant {
        require(to != address(0), "Presale: zero address");
        uint256 bal = usdt.balanceOf(address(this));
        require(bal > 0, "Presale: sin USDT");
        usdt.safeTransfer(to, bal);
        emit UsdtWithdrawn(to, bal);
    }

    /// @notice Recuperar tokens AGROVIDA no vendidos al finalizar la presale.
    function withdrawUnsoldAgro(address to) external onlyOwner nonReentrant {
        require(!presaleOpen, "Presale: debe estar cerrada");
        require(to != address(0), "Presale: zero address");
        uint256 bal = agrovida.balanceOf(address(this));
        require(bal > 0, "Presale: sin tokens");
        agrovida.safeTransfer(to, bal);
    }

    function pause()   external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    // ─── Views ────────────────────────────────────────────────────────────────

    /// @notice Tokens AGROVIDA disponibles aún en la presale.
    function remainingTokens() external view returns (uint256) {
        return agrovida.balanceOf(address(this));
    }

    receive() external payable {}
}
