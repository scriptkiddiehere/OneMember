import axios from 'axios';

const url = 'http://api.onemembr.com/api';
export default axios.create({
  baseURL: url,
});
