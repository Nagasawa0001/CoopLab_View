// 一時ユーザー登録 ////////////////////////////////////////////////////////////////////////////////////////////////////////////
import axios from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';
import '../setting.js';

// 【Action】 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const SIGNUP_TEMP_REQUEST = 'SIGNUP_TEMP_REQUEST';
export const SIGNUP_TEMP_SUCCESS = 'SIGNUP_TEMP_SUCCESS';
export const SIGNUP_TEMP_FAILURE = 'SIGNUP_TEMP_FAILURE';

export function signupTempAction(form) {
    return {
        type: SIGNUP_TEMP_REQUEST,
        form: form
    }
}

// 【Reducer】 //////////////////////////////////////////////////////////////////////////////////////////////////////////////
const initialState = {
    processing: false, //APIレスポンスの有無
    error: '',// 取得失敗時のエラーメッセージ
    authToken: ''
}
export function signupTempReducer(state = initialState, action) {
    switch (action.type) {
        case SIGNUP_TEMP_REQUEST:
            return Object.assign({}, state, { processing: true })

        case SIGNUP_TEMP_SUCCESS:
            return Object.assign({}, state, { processing: false, error: '', authToken: action.authToken });

        case SIGNUP_TEMP_FAILURE:
            return Object.assign({}, state, { processing: false, error: action.error })

        default:
         return Object.assign({}, state);
    }
}

// 【Middleware】////////////////////////////////////////////////////////////////////////////////////////////////////////////
const requestSignup = (form) => axios.post('http://localhost:8080/users/signup/temp', {
    name: form.name, 
    email: form.email, 
    password: form.password
})
    .then((res) => {
        const token = res.data;
        return { token }
    })
    .catch((error) => {
        return { error }
    })

function* signupTemp(context, action) {
    const { token, error } = yield call(requestSignup, action.form);
    if(token) {
        yield put ({ type: SIGNUP_TEMP_SUCCESS, authToken: token});
        yield call (context.history.push('/signup/auth'));
    } else if(error) {
        yield put ({ type: SIGNUP_TEMP_FAILURE, error: '予期せぬエラーが発生しました。開発者に連絡してください' })
    } else {
        yield put ({ type: SIGNUP_TEMP_FAILURE, error: 'このメールアドレスが既に使われています'})
    }
}

function* signupTempSaga(context) {
    yield takeLatest(SIGNUP_TEMP_REQUEST, signupTemp, context);
}

export const signupTempSagas = [
    signupTempSaga,
];
