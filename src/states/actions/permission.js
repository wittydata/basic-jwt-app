export const PERMISSIONS_FETCHED = 'PERMISSIONS_FETCHED'

export const permissionsFetched = (permissions) => {
  return {
    type: PERMISSIONS_FETCHED,
    permissions
  }
}
