import {put, takeEvery} from "redux-saga/effects"
import {uxuiActions} from "@/mi/state/enities/uxui/uxuiSlice";

const _debug = true;

///saga-2
const ENTITY_NAME = "uxui";

function* workLocal(actionData: any) {

    let _params = actionData.payload;
    try {
        ///saga-8
        yield put(
            uxuiActions.setAttributeSuccess(
                actionData.payload
            ),
        );

    } catch (error) {
        console.error("███████ Error fetching 303 " + ENTITY_NAME + ":", error);
        // You can also dispatch a failure action here if you have one
        yield put(
            uxuiActions.setAttributeFailure({
                createErrorData: JSON.stringify(error),
            }),
        )
    }
}

function* setAttributeSaga() {
    console.log("███████████ setAttributeSaga 1 " + ENTITY_NAME);
    ///saga-1-1
    ///saga-1-1
    yield takeEvery(uxuiActions.setAttribute, workLocal)
}

///saga-1-2
export default setAttributeSaga
