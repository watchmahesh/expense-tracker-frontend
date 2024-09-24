import axiosInstance from './axiosInstance';
import { API_ROUTES, CREDENTIALS } from './apiRoutes';

const handleResponse = (response: any) => {
    if (response.status >= 200 && response.status < 300) {
        return response.data;
    }
    throw new Error(`Unexpected response status: ${response.status}`);
}

const storeTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
}

const storeUserDetails = (user: any) => {
    localStorage.setItem('logged_in', 'true');
    localStorage.setItem('user', JSON.stringify(user));
}

const getProfile = async () => {
    try {
        const response = await axiosInstance.get(
            API_ROUTES.get_current_user,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return handleResponse(response);
    } catch (error) {
        console.error('Get profile error:', error);
        throw error;
    }
}

const login = async (email: string, password: string) => {
    try {
        const response = await axiosInstance.post(
            API_ROUTES.login,
            {
                grant_type: CREDENTIALS.grantTypes.PASSWORD,
                email,
                password,
            },
            { headers: { 'Content-Type': 'application/json' } }
        );

        const { access_token, refresh_token } = handleResponse(response).data;
        storeTokens(access_token, refresh_token);

        // Fetch user profile after successful login
        const userProfile = await getProfile();
        storeUserDetails(userProfile);

        return response;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// const refreshToken = async () => {
//     try {
//         console.log('Refreshing token...');

//         const refreshToken = localStorage.getItem('refresh_token');
//         if (!refreshToken) {
//             throw new Error('No refresh token found');
//         }

//         const response = await axiosInstance.post(
//             API_ROUTES.login,
//             {
//                 grant_type: CREDENTIALS.grantTypes.REFRESH_TOKEN,
//                 refresh_token: refreshToken,
//             },
//             { headers: { 'Content-Type': 'application/json' } }
//         );

//         const { access_token, refresh_token } = handleResponse(response);
//         storeTokens(access_token, refresh_token);

//         return response;
//     } catch (error) {
//         console.error('Refresh token error:', error);
//         throw error;
//     }
// }

// const getProfile = async () => {
//     try {
//         const response = await axiosInstance.get(
//             API_ROUTES.get_current_user,
//             { headers: { 'Content-Type': 'application/json' } }
//         );

//         return response;
//     } catch (error) {
//         console.error('Get profile error:', error);
//         throw error;
//     }
// }

// const checkAuthentication = async (): Promise<boolean> => {
//     try {
//       const response = await axiosInstance.get(
//         API_ROUTES.get_current_user, {
//         headers: { 'Content-Type': 'application/json' },
//       });

//       return response.status >= 200 && response.status < 300;
//     } catch (error) {
//       console.error('Error checking authentication:', error);
//       return false;
//     }
//   };

export { login, getProfile };
