/* Rental data requests for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', request = (...args) => fetch(...args) } = {}) => {
    const requireOk = async (response, action) => {
      if(!response.ok) throw new Error(`${action} ${response.status}: ${(await response.text()).slice(0, 200)}`);
      return response;
    };
    const rpc = async (name, payload = {}) => {
      const response = await request(`${supabaseUrl}/rest/v1/rpc/${name}`, {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)
      });
      await requireOk(response, `${name} 调用失败`);
      return response.json();
    };
    const publicCatalog = slug => rpc('merchant_rental_public_catalog', { p_slug:slug });
    const managerList = merchantUserId => rpc('merchant_rental_manager_list', { p_merchant_user_id:merchantUserId });
    const saveSharedService = service => rpc('merchant_rental_save_shared_service', { p_service:service });
    const saveVehicle = (merchantUserId, vehicle) => rpc('merchant_rental_save_vehicle', { p_merchant_user_id:merchantUserId, p_vehicle:vehicle });
    const saveVehicleServices = ({ vehicleId, addonServiceIds, insuranceServiceId }) => rpc('merchant_rental_save_vehicle_services', {
      p_vehicle_id:vehicleId,
      p_addon_service_ids:addonServiceIds,
      p_insurance_service_id:insuranceServiceId
    });
    const saveVehicleAddons = ({ vehicleId, addons = [], luggageCount = 0 }) => rpc('merchant_rental_save_vehicle_addons', {
      p_vehicle_id:vehicleId,
      p_addons:addons,
      p_luggage_count:luggageCount
    });
    const setBookingStatus = ({ bookingId, status, note = '', paymentStatus = null, depositStatus = null }) => rpc('merchant_rental_set_booking_status', {
      p_booking_id:bookingId,
      p_status:status,
      p_note:note,
      p_payment_status:paymentStatus,
      p_deposit_status:depositStatus
    });
    const updateFinancials = payload => rpc('merchant_rental_update_financials', payload);
    const extendBooking = ({ bookingId, endsAt, note = null }) => rpc('merchant_rental_extend_booking', { p_booking_id:bookingId, p_ends_at:endsAt, p_note:note });
    const customerBookings = () => rpc('merchant_rental_customer_bookings');
    return { publicCatalog, managerList, saveSharedService, saveVehicle, saveVehicleServices, saveVehicleAddons, setBookingStatus, updateFinancials, extendBooking, customerBookings };
  };
  window.LeshenghuoRentalApi = { create };
})();
