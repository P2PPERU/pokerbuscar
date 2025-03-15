const db = require("../config/db");

const getJugadorData = async (nombre) => {
  try {
    const query = `
    SELECT 
        p.id_player,
        p.player_name,
        ARRAY_AGG(DISTINCT cl.limit_name) AS stakes_jugados,
        COUNT(chps.id_hand) AS total_manos,
        ROUND(SUM(chps.amt_won) / NULLIF(COUNT(chps.id_hand), 0) * 100, 2) AS bb_100,
        ROUND(SUM(chps.amt_won), 2) AS win_usd,
        ROUND(AVG(CASE WHEN chps.flg_vpip THEN 1 ELSE 0 END) * 100, 2) AS vpip,
        ROUND(AVG(CASE WHEN chps.cnt_p_raise > 0 THEN 1 ELSE 0 END) * 100, 2) AS pfr,
        ROUND(AVG(CASE WHEN chps.flg_p_3bet THEN 1 ELSE 0 END) / COALESCE(NULLIF(AVG(CASE WHEN chps.flg_p_3bet_opp THEN 1 ELSE 0 END), 0), 1) * 100, 2) AS three_bet,
        ROUND(AVG(CASE WHEN chps.flg_f_cbet THEN 1 ELSE 0 END) / COALESCE(NULLIF(AVG(CASE WHEN chps.flg_f_cbet_opp THEN 1 ELSE 0 END), 0), 1) * 100, 2) AS cbet_flop,
        ROUND(AVG(CASE WHEN chps.flg_t_cbet THEN 1 ELSE 0 END) / COALESCE(NULLIF(AVG(CASE WHEN chps.flg_t_cbet_opp THEN 1 ELSE 0 END), 0), 1) * 100, 2) AS cbet_turn,
        ROUND(AVG(CASE WHEN chps.flg_r_cbet THEN 1 ELSE 0 END) / COALESCE(NULLIF(AVG(CASE WHEN chps.flg_r_cbet_opp THEN 1 ELSE 0 END), 0), 1) * 100, 2) AS cbet_river,
        ROUND(AVG(
            (chps.cnt_f_raise + chps.cnt_t_raise + chps.cnt_r_raise + 
             CASE WHEN chps.flg_f_bet THEN 1 ELSE 0 END +
             CASE WHEN chps.flg_t_bet THEN 1 ELSE 0 END +
             CASE WHEN chps.flg_r_bet THEN 1 ELSE 0 END) /
            COALESCE(NULLIF(
              (chps.cnt_f_raise + chps.cnt_t_raise + chps.cnt_r_raise + 
               chps.cnt_f_call + chps.cnt_t_call + chps.cnt_r_call +
               CASE WHEN chps.flg_f_fold THEN 1 ELSE 0 END +
               CASE WHEN chps.flg_t_fold THEN 1 ELSE 0 END +
               CASE WHEN chps.flg_r_fold THEN 1 ELSE 0 END), 0), 1) * 100
        ), 2) AS aggression_frequency,
        ROUND(AVG(CASE WHEN chps.flg_f_saw THEN chps.flg_won_hand::int ELSE NULL END) * 100, 2) AS wwsf,
        ROUND(AVG(CASE WHEN chps.flg_f_saw THEN chps.flg_showdown::int ELSE NULL END) * 100, 2) AS wtsd,
        ROUND(AVG(CASE WHEN chps.flg_showdown THEN chps.flg_won_hand::int ELSE NULL END) * 100, 2) AS wsd
    FROM player p
    JOIN cash_hand_player_statistics chps ON p.id_player = chps.id_player
    JOIN cash_limit cl ON chps.id_limit = cl.id_limit
    WHERE p.player_name ILIKE $1
    GROUP BY p.id_player, p.player_name
    ORDER BY total_manos DESC;
    `;

    const params = [`%${nombre}%`];
    const result = await db.query(query, params);

    return result.rows.length > 0 ? result.rows[0] : null; // ✅ Devuelve solo un objeto

  } catch (error) {
    console.error("❌ Error en getJugadorData:", error.message);
    throw new Error("Error al obtener datos del jugador.");
  }
};

module.exports = { getJugadorData };
