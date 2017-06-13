import http from './base';

export default {
    list: (params) => http.post('category/list', params),

    save: (params) => http.post('category/save', params),

    delete: (params) => http.post('category/delete', params),

    chosen: (pid) => http.post('category/chosen', { pid })
};
