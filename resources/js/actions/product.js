import request from './requests'
import {API} from "../apis";

export default {
    getList(params) {
        return request.get(API.products.index, params)
    },
    get(id) {
        return request.get(API.products.get(id))
    },
    create(data) {
        return request.post(API.products.create, data);
    },
    update(id, data) {
        return request.post(API.products.update(id), data);
    },
    delete(id) {
        return request.delete(API.products.delete(id));
    },
    removeImage(id, imageId) {
        return request.delete(API.products.removeImage(id, imageId));
    }
}
