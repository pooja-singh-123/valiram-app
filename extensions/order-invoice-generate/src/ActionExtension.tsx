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
import { getMetaFieldValue } from "./utils";

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
  const [toast, setToast] = useState(null);

  const handleSubmit = async () => {
    try{
      const response = await getMetaFieldValue(data.selected[0].id);
      console.log("dd"+response);
      // const response = false;
      if(response) {
        setSuccessMessage('Action was successful!');
        setErrorMessage('');
      } else {
        throw new Error('Something went wrong.');
      }
      setToast({ content: 'Action completed successfully!', error: false });
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage('Something went wrong.');
      setToast({ content: 'Something went wrong. Please try again.', error: true });
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