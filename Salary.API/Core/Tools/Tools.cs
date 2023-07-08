using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace Salary.API.Core.Tools
{
    public static class Tools
    {
        public static int InsuredSubstitutionKey = 123;

        public static bool HasMethod(this object objectToCheck, string methodName)
        {
            var type = objectToCheck.GetType();
            return type.GetMethod(methodName) != null;
        }
        #region CALLAsync
        public static async Task<(HttpResponseMessage Response, string Content)> CALLAsync(string ServiceURL, HttpMethod method
        , Dictionary<string, string> Headers
        , Object Body)
        {
            return await CALLAsync(ServiceURL, method, Headers, Body, 1);
        }
        public static async Task<(HttpResponseMessage Response, string Content)> CALLAsync(string ServiceURL, HttpMethod method
        , Dictionary<string, string> Headers
        , Object Body
        , int retryCount)
        {


            using (HttpClient httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Accept.Clear();
                httpClient.DefaultRequestHeaders.CacheControl = new CacheControlHeaderValue { NoCache = true };
                HttpContent httpContent = null;
                if (method != HttpMethod.Get)
                {
                    httpContent = new StringContent(JsonSerializer.Serialize(Body), Encoding.UTF8);
                }
                foreach (KeyValuePair<string, string> Header in Headers)
                {
                    if (Header.Key == "Authorization")
                    {
                        // TODO fazel - dynamic authorization
                        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Header.Value);
                    }
                    else if (httpContent == null)
                    {
                        if (Header.Key == "Content-Type")
                        {
                            httpClient.DefaultRequestHeaders
                              .Accept
                              .Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        }
                        else
                        {
                            httpClient.DefaultRequestHeaders.Add(Header.Key, Header.Value);
                        }
                    }
                    else
                    {
                        if (Header.Key == "Content-Type")
                        {
                            httpContent.Headers.ContentType = new MediaTypeHeaderValue(Header.Value);
                        }
                        else
                        {
                            httpContent.Headers.Add(Header.Key, Header.Value);
                        }
                    }
                }


                HttpResponseMessage response = null;
                for (var i = 1; i <= retryCount; i++)
                {
                    if (method == HttpMethod.Post)
                    {
                        response = await httpClient.PostAsync(ServiceURL, httpContent);
                    }
                    else if (method == HttpMethod.Get)
                    {
                        response = await httpClient.GetAsync(ServiceURL);
                    }

                    if (response.IsSuccessStatusCode)
                    {
                        break;
                    }
                }

                string responseContent = await response.Content.ReadAsStringAsync();

                return (response, responseContent);
            }
        }
        #endregion
        public static DateTime? PersianDateStrToDateTime(string PersianDateTime)
        {
            if (PersianDateTime.IsNullOrEmpty())
            {
                return null;
            }

            var pDate = new Resources.PersianTools.PersianDate(PersianDateTime);
            return pDate.IsValid ? pDate.BaseDateTime : null;
        }
        public static void saveAs(Resources.FileAttachment file, string AttachmentPath)
        {
            var dir = Path.GetDirectoryName(AttachmentPath);
            if (!Directory.Exists(dir))
                Directory.CreateDirectory(dir);
            File.WriteAllBytes(AttachmentPath, file.AttachmentData);
        }
        
        public static (int? userId, string? warningMessage) GetCurrentUserId(ClaimsPrincipal AspUser)
        {
            bool execution = true;
            string warningMessage = "";
            int? UserID = null;

            if (execution)
            {
                UserID = AspUser.FindFirst(ClaimTypes.NameIdentifier)?.Value.CastToType<int?>();
                if (UserID == null || UserID == 0)
                {
                    execution = false;
                    warningMessage = "UnAuth";
                }
            }
            if (execution)
                return (UserID, null);
            else
                return (null, warningMessage);
        }
        //public static async Task<(Users.User? user, string? warningMessage)> GetCurrentUser(HttpContext context, DapperContext dbContext)
        //{
        //    return await GetCurrentUser(context.User, dbContext);
        //}
        //public static async Task<(Users.User? user, string? warningMessage)> GetCurrentUser(ClaimsPrincipal AspUser, DapperContext dbContext)
        //{
        //    bool execution = true;
        //    string warningMessage = "";
        //    Users.User? user = null;
        //    int? UserID = null;

        //    if (execution)
        //    {
        //        (UserID, warningMessage) = GetCurrentUserId(AspUser);
        //        if (UserID == null)
        //        {
        //            execution = false;
        //        }
        //    }
        //    if (execution)
        //    {
        //        var users = await dbContext.queryAsync<Users.User>("select * from users where UserID = @UserID", new { UserID });

        //        if (users == null)
        //        {
        //            execution = false;
        //            warningMessage = dbContext.LastError;
        //        }
        //        else if (users.Count() != 1)
        //        {
        //            execution = false;
        //            warningMessage = "اشکال در بازیابی اطلاعات کاربری. لطفا با پشتیبانی نرم افزار تماس بگیرید.";
        //        }
        //        else
        //        {
        //            user = users.First();
        //        }
        //    }
        //    if (execution)
        //        return (user, null);
        //    else
        //        return (null, warningMessage);
        //}
        public static string getIP(HttpContext httpContext)
        {
            var IP = httpContext.Connection.RemoteIpAddress?.ToString();
            if (IP == null)
                IP = "0.0.0.0";
            else if (IP == "::1")
                IP = "127.0.0.1";
            return IP;
        }

        public static string getPagingSQL(ref Dictionary<string, object> parameters, string orderBy, int pageIndex, int pageSize)
        {
            parameters.Add("PageNext", pageSize);
            parameters.Add("PageOffset", pageIndex * pageSize);
            string PagingSql = $" ORDER BY {orderBy} desc OFFSET @PageOffset ROWS FETCH NEXT @PageNext ROWS ONLY";

            return PagingSql;
        }
    }
}
