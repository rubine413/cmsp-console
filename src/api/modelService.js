import http from './base';

export default {
    list: (params) => http.post('model/list', params),

    save: (params) => http.post('model/save', params),

    delete: (params) => http.post('model/delete', params)
};
