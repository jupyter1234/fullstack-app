import {createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../utils/axios';

//함수를 반환할 수 있다
//dispatch : action을 reducer로 보내는 거
//백엔드에 API 요청
export const registerUser = createAsyncThunk(
    "user/registerUser",
    async (body,thunkAPI) => {
        try{
            //post method를 이용하여 /users/register 서버로 전송함
            const response = await axiosInstance.post(
                '/users/register',
                body
            )
            return response.data;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)

export const loginUser = createAsyncThunk(
    "user/loginUser",
    async (body,thunkAPI) => {
        try{
            //post method를 이용하여 /users/register 서버로 전송함
            const response = await axiosInstance.post(
                '/users/login',
                body
            )
            //백엔드의 응답을 받아야됨
            return response.data;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)

export const authUser = createAsyncThunk(
    //type prefix
    "user/authUser",
    //받아오는 인수 없으니깐 첫번째 매개변수 : _ , thunkAPI는 무조건 두번쨰변수
    async (_, thunkAPI) => {
        try{
            //get method를 이용하여 /users/auth 서버로 전송함
            const response = await axiosInstance.get(
                //endpoint -> server에서 처리하게되는 api
                '/users/auth'
            );
            //백엔드의 응답을 받아야됨
            return response.data;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)

export const logoutUser = createAsyncThunk(
    //type prefix
    "user/logoutUser",
    //받아오는 인수 없으니깐 첫번째 매개변수 : _ , thunkAPI는 무조건 두번쨰변수
    async (_, thunkAPI) => {
        try{
            //post method를 이용하여 /users/logout 서버로 전송함
            const response = await axiosInstance.post(
                //endpoint -> server에서 처리하게되는 api
                '/users/logout');
            //백엔드의 응답을 받아야됨
            return response.data;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)