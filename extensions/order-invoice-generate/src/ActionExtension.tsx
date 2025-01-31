import {useEffect, useState} from 'react';
import {
  reactExtension,
  useApi,
  AdminAction,
  BlockStack,
  Button,
  Text,
  Banner,
} from '@shopify/ui-extensions-react/admin';
import { getMetaFieldValue, getOrderData, callMailAPI } from "./utils";


// The target used here must match the target used in the extension's toml file (./shopify.extension.toml)
// const TARGET = 'admin.product-details.action.render';
const TARGET = 'admin.order-details.action.render';


export default reactExtension(TARGET, () => <App />);

function App() {
  // The useApi hook provides access to several useful APIs like i18n, close, and data.
  const {i18n, close, data} = useApi(TARGET);
  // console.log({data});

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [metaValue, setMetaValue] = useState([]);
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    getMetaFieldValue(data.selected[0].id).then(metaVal => setMetaValue(metaVal || []));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getOrderData(data.selected[0].id).then(email => setOrderData(email || []));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    try{
      const QRValue = await getMetaFieldValue(data.selected[0].id);
      const orderInfo = await getOrderData(data.selected[0].id);
      // const response = false;
      if(QRValue) {
        const requestBody = JSON.stringify({
            "orderID": data.selected[0].id,
            "orderData": orderInfo
        });
        // console.log(requestBody);
        let info = await callMailAPI(requestBody);
        console.log(info);
        if(info.ok) {
          setSuccessMessage(i18n.translate('successMessage'));
          setErrorMessage('');
        } else {
          setSuccessMessage('');
          throw new Error(i18n.translate('errorMessage'));
        }
      }
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage(i18n.translate('errorMessage'));
    }
  };

  // Use direct API calls to fetch data from Shopify.
  // See https://shopify.dev/docs/api/admin-graphql for more information about Shopify's GraphQL API

  return (
    // The AdminAction component provides an API for setting the title and actions of the Action extension wrapper.
    <AdminAction
      primaryAction={
        <Button
          onPress={handleSubmit}
        >
          Send
        </Button>
      }
      secondaryAction={
        <Button
          onPress={() => {
            console.log('closing');
            close();
          }}
        >
          Close
        </Button>
      }
    >

      <BlockStack>
        {/* Set the translation values for each supported language in the locales directory */}
        <Text fontWeight="bold">{i18n.translate('message')}</Text>
        {successMessage && (
            <Banner>
               {successMessage}
            </Banner>
          )}
        {errorMessage && (
          <Banner>
            {errorMessage}
          </Banner>
        )}
      </BlockStack>
    </AdminAction>
  );
}