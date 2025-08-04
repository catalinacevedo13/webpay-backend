const { WebpayPlus } = require("transbank-sdk");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Método no permitido");
    return;
  }

  const {
    buy_order,
    session_id,
    amount,
    return_url
  } = req.body;

  const parentCommerceCode = "597059995298";
  const childCommerceCode = "597059995298";
  
  const tx = new WebpayPlus.MallTransaction();

  try {
    const response = await tx.create(
      buy_order,
      session_id,
      return_url,
      [
        {
          commerce_code: childCommerceCode,
          buy_order: `orden-${buy_order}`,
          amount: amount
        }
      ]
    );

    const url = `${response.url}?token_ws=${response.token}`;
    res.status(200).json({ url });

  } catch (error) {
    console.error("Error al crear transacción:", error);
    res.status(500).json({ error: "Error al crear transacción" });
  }
};