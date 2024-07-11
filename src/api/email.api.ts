export const sendEmail = async (to: any, business: string, authCode: string) => {
  const url = 'https://send.api.mailtrap.io/api/send';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Api-Token': 'a9f226b00cd5cdc74d1ef564641701fa'
    },
    body: `{"to":[{"email":"${to.email}","name":"${to.name}"}],"from":{"email":"contact@fundly.tech","name":"David Guri"},"headers":{"X-Message-Source":"app.fundly.tech"},"subject":"Welcome To Fundly!","text":"You've been invited to join Fundly from ${business}. Here's your auth code: ${authCode}"`
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}