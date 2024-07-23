export async function getMetaFieldValue(orderId) {
  // This example uses metafields to store the data. For more information, refer to https://shopify.dev/docs/apps/custom-data/metafields.
  const res = await makeGraphQLQuery(
    `query Order($id: ID!) {
      order(id: $id) {
          metafield(namespace: "custom", key:"qrcode") {
              value
          }
      }
    }
  `,
    { id: orderId }
  );

  if (res?.data?.order?.metafield) {
    console.log("aa"+res.data.order.metafield);
  console.log("bb"+res.data.order.metafield.value);
    return res.data.order.metafield;
  } else if(res.errors?.[0].message) {
    console.log("cc"+res.errors?.[0].message);
    throw new Error(res.errors?.[0].message);
  } else{
    console.log("ffwww");
    throw new Error("No Data Found.");
  }
}

async function makeGraphQLQuery(query, variables) {
  const graphQLQuery = {
    query,
    variables,
  };

  const res = await fetch("shopify:admin/api/graphql.json", {
    method: "POST",
    body: JSON.stringify(graphQLQuery),
  });
  console.log("kk"+res.json());
  if (!res.ok) {
    console.error("Network error");
  }

  return await res.json();
}