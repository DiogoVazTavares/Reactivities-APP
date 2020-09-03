import axios, { AxiosResponse } from "axios";
import { IActivity } from "../models/activity";
import { history } from "../..";
import { toast } from "react-toastify";

axios.defaults.baseURL = "http://localhost:5000/api/";

//handling errors in client side
//Interceptors are about adding behavior…to existing code to solve cross-cutting concerns
//and are part of the aspect-oriented programming paradigm.…
//Now, cross-cutting concerns are non-business-related concerns, such as logging and security.
//They do not solve a business problem

axios.interceptors.response.use(undefined, (error) => {
  // console.log(error);
  if (error.message === "Network Error" && !error.response) {
    toast.error("Network error- Check if API is runnung");
  }
  const { status, data, config } = error.response;
  //We would have done like this if we don't have access to the history.
  // Throw the error to the caller until we get to the point we have access to the history.
  //In this case we throw to the activityStore, there we throw and it goes to the activityDetails where we can catch and handle the error
  // if (status === 404) {
  //   throw error.response;
  // }

  //We can import history here because we export it in index.tsx and we pass the history to the Router
  if (status === 404) {
    history.push("/notfound");
  }
  // we are relying on this 3 params to say that it wasn't requested a valid GUID
  if (
    status === 400 &&
    config.method === "get" &&
    data.errors.hasOwnProperty("id")
  ) {
    history.push("/notfound");
  }
  if (status === 500) {
    toast.error("Server error - Check your terminal seu burro!");
  }
  throw error;
});

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => resolve(response), ms)
  );

const requests = {
  get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
  post: (url: string, body: {}) =>
    axios.post(url, body).then(sleep(1000)).then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(sleep(1000)).then(responseBody),
  delete: (url: string) =>
    axios.delete(url).then(sleep(1000)).then(responseBody),
};

const Activities = {
  list: (): Promise<IActivity[]> => requests.get("/activities"),
  details: (id: string) => requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post("/activities", activity),
  update: (activity: IActivity) =>
    requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.delete(`/activities/${id}`),
};

export default { Activities };
