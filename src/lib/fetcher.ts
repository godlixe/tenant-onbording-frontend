import checkIntegratedMode from "./framework";

const fetcher = (url: string) => checkIntegratedMode() ?
  fetch(
    `${process.env.NEXT_PUBLIC_IAM_HOST}${url}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => {
      return res.json()
    })
    .catch((error) => {
      console.error("Error:", error);
    }) :

  fetch(
    `${process.env.NEXT_PUBLIC_ONBOARDING_HOST}${url}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => {
      return res.json()
    }).then((data) => {
      return data.data
    })
    .catch((error) => {
      console.error("Error:", error);
    });

export default fetcher;