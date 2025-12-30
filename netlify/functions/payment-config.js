export const handler = async () => {
  const paystackPublicKey = process.env.PAYSTACK_PUBLIC_KEY ?? "";

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify({ paystackPublicKey }),
  };
};
