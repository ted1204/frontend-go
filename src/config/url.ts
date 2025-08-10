export const API_BASE_URL = "http://10.121.124.22:30080";
// auth
export const LOGIN_URL = `${API_BASE_URL}/login`;
export const REGISTER_URL = `${API_BASE_URL}/register`;
//groups
export const GROUPS_URL = `${API_BASE_URL}/groups`;
export const GROUP_BY_ID_URL = (id: number) => `${API_BASE_URL}/groups/${id}`;
// user groups
export const USER_GROUP_URL = `${API_BASE_URL}/user-group`;
export const USER_GROUP_BY_GROUP_URL = `${API_BASE_URL}/user-group/by-group`;
export const USER_GROUP_BY_USER_URL = `${API_BASE_URL}/user-group/by-user`;
// config files
export const CONFIG_FILES_URL = `${API_BASE_URL}/config-files`;
export const CONFIG_FILE_BY_ID_URL = (id: number) => `${API_BASE_URL}/config-files/${id}`;
export const CONFIG_FILE_RESOURCES_URL = (id: number) => `${API_BASE_URL}/config-files/${id}/resources`;
//resources
export const RESOURCES_URL = `${API_BASE_URL}/resources`;
export const RESOURCE_BY_ID_URL = (id: number) => `${API_BASE_URL}/resources/${id}`;
// projects
export const PROJECTS_URL = `${API_BASE_URL}/projects`;
export const PROJECT_BY_ID_URL = (id: number) => `${API_BASE_URL}/projects/${id}`;
export const PROJECT_CONFIG_FILES_URL = (id: number) => `${API_BASE_URL}/projects/${id}/config-files`;
export const PROJECT_RESOURCES_URL = (id: number) => `${API_BASE_URL}/projects/${id}/resources`;
// pvc
export const PVC_CREATE_URL = `${API_BASE_URL}/pvc`;
export const PVC_EXPAND_URL = `${API_BASE_URL}/pvc/expand`;
export const PVC_LIST_URL = (namespace: string) => `${API_BASE_URL}/pvc/list/${namespace}`;
export const PVC_GET_URL = (namespace: string, name: string) => `${API_BASE_URL}/pvc/${namespace}/${name}`;
export const PVC_DELETE_URL = (namespace: string, name: string) => `${API_BASE_URL}/pvc/${namespace}/${name}`;
// users
export const USERS_URL = `${API_BASE_URL}/users`;
export const USER_BY_ID_URL = (id: number) => `${API_BASE_URL}/users/${id}`;
// instance
export const INSTANCE_URL = `${API_BASE_URL}/instance`;
export const INSTANCE_BY_ID_URL = (id: number) => `${INSTANCE_URL}/${id}`;