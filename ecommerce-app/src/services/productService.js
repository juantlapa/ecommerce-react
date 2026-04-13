import { http } from "./http";


export const getProducts = async (page, limit) => {
  try {
    const response = await http.get("products", { params: { page, limit } });
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getProductById = async (id) => {
  try {
    const response = await http.get(`products/${id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};
