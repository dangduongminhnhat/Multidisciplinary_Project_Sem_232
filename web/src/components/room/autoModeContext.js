import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { useGetAllDevicesQuery } from "./roomService";
import { useGetAllRoomsQuery } from "../garden/gardenService";
import { useUpdateDeviceDataMutation } from "../device/deviceService";

const AutoModeContext = createContext();

export function useAutoMode() {
    return useContext(AutoModeContext);
}

export const AutoModeProvider = ({ children }) => {
    const { data: room_list, refetch: refetchRoom } = useGetAllRoomsQuery();
    const { data: device_list_room, refetch: refetchDeviceRoom } = useGetAllDevicesQuery();
    const [isOn, setIsOn] = useState({});
    const [tempHistory, setTempHistory] = useState({});
    const [thresholds, setThresholds] = useState({});
    const [updateDevice] = useUpdateDeviceDataMutation();
    const [isReady, setIsReady] = useState(false);
    const [initialized, setInitialized] = useState(false); 
    const tempHistoryRef = useRef(tempHistory); 
    const isOnRef = useRef(isOn); 
    const thresholdsRef = useRef(thresholds);

    useEffect(() => {
        tempHistoryRef.current = tempHistory; 
    }, [tempHistory]);

    useEffect(() => {
        isOnRef.current = isOn;
    }, [isOn]);

    useEffect(() => {
        thresholdsRef.current = thresholds;
    }, [thresholds]);

    useEffect(() => {
        setIsReady(false);
        const fetchData = async () => {
            await refetchRoom();
            await refetchDeviceRoom();
            setIsReady(true);
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isReady && room_list && device_list_room) {
            const tempSensors = device_list_room.data.filter(device => device.type === 'temp-sensor');
            const initialHistory = {};
            const initialIsOn = { ...isOn };
            const initialThresholds = { ...thresholds };
            let updateIsOn = Object.keys(isOn).length === 0;
            let updateThresholds = Object.keys(thresholds).length === 0;

            room_list.data.forEach(room => {
                const roomId = `${room.garden_id}-${room._id}`;
                initialHistory[roomId] = {};
                if (updateIsOn || initialIsOn[roomId] !== room.isAutoFan) {
                    initialIsOn[roomId] = room.isAutoFan;
                }
                if (updateThresholds || initialThresholds[roomId] !== room.threshold) {
                    initialThresholds[roomId] = room.threshold;  
                }
                
                tempSensors.forEach(sensor => {
                    initialHistory[roomId][sensor._id] = [];
                });
            });
            setTempHistory(initialHistory);
            setIsOn(initialIsOn);
            setThresholds(initialThresholds);
            setInitialized(true);
        }
    }, [isReady, room_list, device_list_room]);

    useEffect(() => {
        if (initialized) {
            const updateInterval = setInterval(() => {
                const newHistory = { ...tempHistoryRef.current };
                device_list_room.data.filter(device => device.type === 'temp-sensor').forEach(sensor => {
                    const roomId = `${sensor.garden_id}-${sensor.room_id}`;
                    if (!newHistory[roomId]) newHistory[roomId] = {};
                    if (!newHistory[roomId][sensor._id]) newHistory[roomId][sensor._id] = [];
                    newHistory[roomId][sensor._id] = [...newHistory[roomId][sensor._id], parseFloat(sensor.curr_value)];
                });
                setTempHistory(newHistory); 
            }, 1000);

            const averageInterval = setInterval(() => {
                const newHistory = { ...tempHistoryRef.current };
                const shouldActivate = {};

                Object.keys(newHistory).forEach(roomId => {
                    shouldActivate[roomId] = false;

                    Object.keys(newHistory[roomId]).forEach(sensorId => {
                        const history = newHistory[roomId][sensorId];
                        const avgTemp = history.length > 0 ? history.reduce((acc, curr) => acc + curr, 0) / history.length : 0;
                        newHistory[roomId][sensorId] = [];
                        if (avgTemp > thresholdsRef.current[roomId]) {
                            shouldActivate[roomId] = true;
                        }
                    });

                    if (shouldActivate[roomId] && isOnRef.current[roomId]) {
                        activeFan(roomId);
                        console.log("Activating fan for room:", roomId);
                    } else if (!shouldActivate[roomId] && isOnRef.current[roomId]) {
                        inactiveFan(roomId);
                        console.log("Deactivating fan for room:", roomId);
                    }
                });

                setTempHistory(newHistory); 
            }, 5000);

            return () => {
                clearInterval(updateInterval);
                clearInterval(averageInterval);
            };
        }
    }, [initialized, device_list_room]);

    const activeFan = async (roomId) => {
        const fans = device_list_room.data.filter(device => device.type === 'fan' && device.room_id === roomId.split('-')[1]);
        for (const fan of fans) {
            if (fan.curr_state === "0" || fan.curr_state === null) {
                await updateDevice({ device_id: fan._id, data: "1" });
            }
        }
    };

    const inactiveFan = async (roomId) => {
        const fans = device_list_room.data.filter(device => device.type === 'fan' && device.room_id === roomId.split('-')[1]);
        for (const fan of fans) {
            if (fan.curr_state === "1" || fan.curr_state === null) {
                await updateDevice({ device_id: fan._id, data: "0" });
            }
        }
    };
    const toggleAutoLed = async (roomId, gardenId, mode) => {
        const leds = device_list_room.data.filter(device => device.type === 'led' && device.room_id === roomId && device.garden_id === gardenId);
        console.log(leds)
        if (mode) {
            console.log("Activate Led");
            for (const led of leds) {
                /*
                if (led.curr_state == "0" || led.curr_state == null) {
                    console.log("ON");
                    await updateDevice({ device_id: led._id, data: "1" });
                }*/
                await updateDevice({ device_id: led._id, data: "1" });
            }
        }
        else {
            console.log("Deactivate Led");
            for (const led of leds) {
                /*if (led.curr_state == "1" || led.curr_state == null) {
                    console.log("OFF");
                    await updateDevice({ device_id: led._id, data: "0" });
                }*/
                await updateDevice({ device_id: led._id, data: "0" });
            }
        }
        
    }
    const toggleAutoMode = (roomId) => {
        setIsOn(prevIsOn => ({
            ...prevIsOn,
            [roomId]: !prevIsOn[roomId]
        }));
    };

    const setThreshold = (roomId, thresholdValue) => {
        setThresholds(prevThresholds => ({
            ...prevThresholds,
            [roomId]: thresholdValue
        }));
    };

    const value = {
        isOn,
        tempHistory,
        toggleAutoMode,
        thresholds,
        setThreshold,
        toggleAutoLed,
    };

    return (
        <AutoModeContext.Provider value={value}>
            {children}
        </AutoModeContext.Provider>
    );
};
