import { create } from 'zustand';

export const useStore = create((set) => ({
  currentZone: null,
  setCurrentZone: (zone) => set({ currentZone: zone }),
  joystickValues: { x: 0, y: 0 },
  setJoystickValues: (values) => set({ joystickValues: values }),
  vehiclePos: [0, 0, 0],
  setVehiclePos: (pos) => set({ vehiclePos: pos })
}));
