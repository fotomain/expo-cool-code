import {createSlice} from "@reduxjs/toolkit"

export const sliceFabric = (p: any) => {
    return createSlice({
        ///02
        name: p.entityName + "Slice",
        initialState: {
            ///03
            sliceCreated: Date.now(),
            entityDataFromServer: null,
            attributes: {},
            ...p.entityAttributes,
            isCreating: false,
            isReading: false,
            isUpdating: false,
            isDeleting: false,

            createSuccesfull: -1,
            readSuccesfull: -1,
            updateSuccesfull: -1,
            deleteSuccesfull: -1,

            createErrorData: "",
            readErrorData: "",
            updateErrorData: "",
            deleteErrorData: "",

            lastCreatedData: null,
            lastUpdatedData: null,
            lastDeletedData: null,

            crudMoment: 0,
        },
        reducers: {
            setAttributeSuccess: (state, action) => {

                // const _key: string = Object.keys(action.payload)[0];
                // const _value: any = action.payload[Object.keys(action.payload)[0]];
                // state[_key] = _value;
                // state.attributes = {...state.attributes, [_key]: _value};
                // console.log("========== setAttributeSuccess _key ", _key, _value);
                //
                // if (_key === "isPortrait") {
                //     state["isLandscape"] = !_value
                // }
                // if (_key === "isLandscape") {
                //     state["isPortrait"] = !_value
                // }


            },
            setAttribute: (state, action) => {
                console.log("========== action.payload.keys ", Object.keys(action.payload));

                state.crudMoment = Date.now();
                const _key: string = Object.keys(action.payload)[0];
                const _value: any = action.payload[Object.keys(action.payload)[0]];
                state[_key] = _value;
                console.log("========== setAttribute _key ", _key, _value);

                if (_key === "isPortrait") {
                    state["isLandscape"] = !_value
                }
                if (_key === "isLandscape") {
                    state["isPortrait"] = !_value
                }
            },
            // setGUID: (state, action) => {
            //     p?.setGUID(state, action)
            // },
            // setEmail: (state, action) => {
            //     p?.setEmail(state, action)
            // },
            setActualData: (state, action) => {
                p?.setActualData(state, action)
            },
            clearActualData: (state, action) => {
                p?.clearActualData(state, action)
            },
            // █████████████████ CREATE
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            createOne: (state: any, action: any) => {
                state.isCreating = true;
                state.createSuccesfull = -1;
                state.createErrorData = ""
            },
            createOneSuccess: (state, action) => {
                state.lastCreatedData = action.payload.lastCreatedData;
                state.isCreating = false;
                state.createSuccesfull = action.payload.createSuccesfull;
                state.crudMoment = Date.now()
            },
            createOneFailure: (state, action) => {
                state.isCreating = false;
                state.createSuccesfull = 0;
                state.createErrorData = action.payload.createErrorData;
                state.entityDataFromServer = null;
                state.crudMoment = Date.now()
            },
            // █████████████████ READ
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            readData: (state: any, action: any) => {
                console.log("==== action.payload0 ", action.payload);
                // console.log("==== action.payload ",action.payload?.previousState)
                // console.log("==== state.entityDataFromServer ", state?.entityDataFromServer)
                // before new stat -> old data needed
                // state={...action.payload.previousData1,...state}
                // state.entityDataFromServer = action.payload.previousData;
                state.isReading = true;
                state.readSuccesfull = -1;
                state.readErrorData = ""
            },
            readDataSuccess: (state, action) => {
                state.entityDataFromServer = action.payload.entityDataFromServer;
                state.isReading = false;
                state.readSuccesfull = action.payload.readSuccesfull
            },
            readDataFailure: (state, action) => {
                state.isReading = false;
                state.readSuccesfull = 0;
                state.readErrorData = action.payload.readErrorData;
                state.entityDataFromServer = null
            },
            // █████████████████ UPDATE
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            updateOne: (state: any, action: any) => {
                state.isUpdating = true;
                state.updateSuccesfull = -1;
                state.updateErrorData = ""
            },
            updateOneSuccess: (state, action) => {
                state.lastUpdatedData = action.payload.lastUpdatedData;
                state.isUpdating = false;
                state.updateSuccesfull = action.payload.updateSuccesfull;
                state.crudMoment = Date.now()
            },
            updateOneFailure: (state, action) => {
                state.isUpdatting = false;
                state.updateSuccesfull = 0;
                state.updateErrorData = action.payload.updateErrorData;
                state.entityDataFromServer = null;
                state.crudMoment = Date.now()
            },
            // █████████████████ DELETE
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            deleteOne: (state: any, action: any) => {
                state.isDeleting = true;
                state.deleteSuccesfull = -1;
                state.deleteErrorData = ""
            },
            deleteOneSuccess: (state, action) => {
                state.lastDeletedData = action.payload.lastDeletedData;
                state.isDeleting = false;
                state.deleteSuccesfull = action.payload.deleteSuccesfull;
                state.crudMoment = Date.now()
            },
            deleteOneFailure: (state, action) => {
                state.isDeleting = false;
                state.deleteSuccesfull = 0;
                state.deleteErrorData = action.payload.deleteErrorData;
                state.crudMoment = Date.now()
            },
        },
    })
};
