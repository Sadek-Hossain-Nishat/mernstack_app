// migo backend
// 2023
// author by Sadek Hossain Nishat

// starting command => just open a terminal in your project directory and run
  'npm start'

// local server url is => http://localhost:4000

// api endpoints
1. to register a new user 
post method => api endpoint=> /api/register  
required: register user data object 
data=> {
name: //username
email: // user email
password: // user password
imgUrl: // user imgUrl
} 

2. to login a new user
post method => api endpoint=>  /api/login?email={email}&password={password}  
output:it will return user's userToken to get the user information

3. to get logged user information 
get method => api endpoint=> /api/loggeduser 
required: authorization header
headers: {
            Authorization: "Bearer " + token,  // from login
            "Content-Type": "application/json",
          }


4. to get other users information
get method => api endpoint => /api/{useremail}/otherusers


5. to create a block of a user
post method => api endpoint => /api/addblock
required:block data object
{
          useremail: //usermail,
          blockemail: //chatuseremail,
}


6. to check that the chatuser is blocked or not
get method => api endpoint => /api/{useremail}/{chatuseremail}/isblock
output:see console or print the output result


7. to remove block from the blocked user
post method => api endpoint => /api/{id}/removeblock
here id you will get 6 no. endpoint

8. to upload a single or multiple files or to share a single or  multiple files to a user
post method => api endpoint => /api/{senderemail}/upload/{receiveremail}
required: file data
for example:
for react
  const data = new FormData();
  data.append("filepaths[]", file);
// pass this data into rest api function


9. to download a single or multiple files or to receive a single or  multiple files from a user 
// method is not implemented
// please implement this method in UploadandDownloadController.js in 'download' function
get method => api endpoint => /api/{senderemail}/download/{receiveremail}


10. to remove a single or multiple files 
// method is not implemented
// please implement this method in UploadandDownloadController.js in 'removefiles' function
post method => api endpoint => api/{senderemail}/removefiles/{receiveremail}






11. real time messaging using socket io
for example 
for react
message data object =  

{
      senderemail: localStorage.getItem("email"), //user email
      receiveremail: chatuser.email, //chatuser email
      text: fileObj
        ? `${fileObj.name} \n ${fileObj.size}\n ${fileObj.type}`
        : message,
      sendingdate: new Date().toDateString(),
      receivername: chatuser.name,
      sendername: JSON.parse(localStorage.getItem("loggeduser")).name,
      sendersocketID: currentuser.socketID,
      receiversocketID: chatuser.socketID,
      ismessageblock: blockmessagestatus ? "yes" : "no",
      filetype: fileObj ? fileObj.type : "plain/text",
      sendingtime: new Date().toLocaleTimeString(),
      messageId: `${localStorage.getItem("email")}=>${new Date()}`,
    }



// to properly understand all things please analyze 
models, controllers, middleware and routes folder

