import { createSlice } from "@reduxjs/toolkit";
import { authUser, loginUser, logoutUser, registerUser } from "./thunkFunctions";
import { toast } from "react-toastify";

const initialState = {
    userData: {
        id: '',
        email: '',
        name: '',
        role: 0, //0이면 일반유저 1이면 관리자
        image: '',
    },
    isAuth: false,
    isLoading: false,
    error: ''
}
const userSlice = createSlice({
    name: 'user',
    initialState, //initialState = initialState
    reducers: {},
    extraReducers: (builder) => {
        builder

        //회원가입 케이스들
        .addCase(registerUser.pending, (state) => {
            state.isLoading = true;
        })
        //회원가입 성공시
        .addCase(registerUser.fulfilled, (state) => {
            state.isLoading = false;
            toast.info('회원가입을 성공했습니다.');
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            toast.error(action.payload);
        })

        .addCase(loginUser.pending, (state) => {
            state.isLoading = true;
        })
        //로그인 성공시
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            //payload 값이 userData가 된다
            //action.payload : 백엔드에서 처리하고 보내는 res
            state.userData = action.payload;
            //상태 변경 (현재 로그인 상태이다)
            state.isAuth = true;
            //key : accessToken value : action.payload.accessToken
            localStorage.setItem('accessToken',action.payload.accessToken)

        })
        .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            toast.error(action.payload);
        })

        //인증상태가 변화하였을때
        .addCase(authUser.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(authUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.userData = action.payload;
            state.isAuth = true;
        })
        .addCase(authUser.rejected, (state, action) => {
            //토큰이 만료된 경우
            state.isLoading = false;
            state.error = action.payload;
            state.isAuth = false;
            //만료된 토큰 삭제
            localStorage.removeItem('accessToken')

        })
        //로그아웃
        .addCase(logoutUser.pending, (state) => {
            state.isLoading = true;
        })
        //로그아웃 성공시, auth변화, token삭제
        .addCase(logoutUser.fulfilled, (state) => {
            state.isLoading = false;
            state.userData = initialState.userData;
            state.isAuth = false;
            localStorage.removeItem('accessToken')
        })
        .addCase(logoutUser.rejected, (state, action) => {
            //토큰이 만료된 경우
            state.isLoading = false;
            state.error = action.payload;
            state.isAuth = false;
            //만료된 토큰 삭제
            localStorage.removeItem('accessToken')

        })
    }
})

export default userSlice.reducer;