import { http } from '@/modules/core/api/http.ts'

export function store (cartId: string, item: Record<string, any>) {
  return http.post(`/v1/orders/${cartId}`, item)
}

export function update (cartId: string, id: string | number, item: Record<string, any>) {
  return http.put(`/v1/orders/${cartId}/${id}/update`, item)
}

export function show (id: number | string) {
  return http.get(`/v1/orders/${id}/show`)
}

export function edit (cartId: string, id: number | string) {
  return http.get(`/v1/orders/${cartId}/${id}/edit`)
}

export function cancel (id: number | string, item: Record<string, any>) {
  return http.post(`/v1/orders/${id}/cancel`, item)
}

export function refund (id: number | string, item: Record<string, any>) {
  return http.post(`/v1/orders/${id}/refund`, item)
}

export function getUpdateStatusMeta (id: number | string) {
  return http.get(`/v1/orders/${id}/update-status/meta`)
}

export function activeOrders (branchId?: number | null) {
  return http.get(`/v1/orders/active`, { params: { branch_id: branchId } })
}

export function upcomingOrders (branchId?: number | null) {
  return http.get(`/v1/orders/upcoming`, { params: { branch_id: branchId } })
}

export function storePayment (id: number | string, data: Record<string, any>) {
  return http.post(`/v1/orders/${id}/payments`, data)
}

export function getPaymentMeta (id: number | string) {
  return http.get(`/v1/orders/${id}/payments/meta`)
}

export function moveToNextStatus (id: number | string) {
  return http.patch(`/v1/orders/${id}/move-to-next-status`)
}

export function getPrintMeta (id: number | string, branchId?: number | null, registerId?: number | null) {
  return http.get(`/v1/orders/${id}/print`, { params: { branch_id: branchId, register_id: registerId } })
}

export function print (id: number | string, type: string, specificId?: number) {
  return http.post(`/v1/orders/${id}/print/${type}`, { params: { specific_id: specificId } })
}

export function printPreview (id: number | string, type: string, kitchenId?: number | null) {
  return http.get(`/v1/orders/${id}/print/${type}/preview`, { params: { kitchen_id: kitchenId } })
}
