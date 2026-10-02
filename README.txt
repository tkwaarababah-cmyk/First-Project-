firstllry i want to talke abreif in my proj tracher expenses this project at first i creat a backend insially with database i created dadtabase in bgaadmine then i go to visiual code to create fial with name .env this fial is contain bassword an port,name of DB this is very important fail i shoulnt shar it .aftert that i trun the terminal and creat express  this library of server and route and download node model packge.json exc.and create fail server.js this fial i write ci=ode in it to uplaoded the express library and cors this core is midelwere which allow the http rewuest from fronted to acsees the backend and acsess the data after chick if it the same port or cors polici is allow it to acsess and uploadded the pg thiss fail DB in server  and we use express.jeson to converte the json string that commig from frontend http request to hava script i can use it to code server ande then create object from pool to use it in DB afer that i test five http request i would to explane that :
fiestly :
Get http request :use route that req ,res in asyn function (this mean this function is always return promis ,await that mean this wait for function settl or return there result or promise)and this reout is contain get  endpoint and result is querey select from DB if there was result (200-secssuful request )and for reject promise (500-server errror)
 

get by id :
 the same of step but with sepsific id so i creat route tha  taken  get http (endpoint /id) res as asyn function that wuerey from DB to return res.jeson and the roe in (result.rows) but in (res.json ) i convert result from javascript to json string to allow move data in network and we use awit twic one for check promise http request if there promis with result or not (!response.ok) and the second await i use it for respose.jeson(result.row[0]) i mean the seuccsseful request in body messge .this function return res,result if there was result or 404 code the id not founded or 500 code this mean ereeo server. 



post http request :
create post  route that contain endpoint and asyn /await function(req,res)
pool querey to create a row in DB 
 WE get the information that user insert it in fronted and check in it if  not vaild return 400 rerro this mean  client error mabye from user or vaild and allow to createand add row in DB and we use $1 parameter to prevent SQL injection so we seperat the pool querey and parameter value 
i convert date(yyyy-mm-dd) to string and amount(10,2) to  floate88 (10.2) in returnnig value from db sense dn handel date in this structure yyy-mm-dd and i convert it to string to easy use and understood  in js and in fronted to user after i created the row sussfly return  res.state(201).json(result.row[0])
if there was rerro i rreturn 400 error from client or bad request .



-put method 
repeat the stepi create a rout.put  that reseve endpoint with async function (req.res) we get the url and to edite the spescfic roe in db we take the info from req.body and we check in it if vaild we  pool.querey and update expensses in db then return res.status(200). json (result.row[])or not vaild return 400 reorr by client (bad request ).


- delete request 
creat rout that contain endpoint in asyn /await function (req,res) 
and after read the id from req.parameter 
in pool.querey statment  if the id is founded return res..ststus(200).json(result.row ) mean the delete request scusseflly if the id not founded return 404 ereeo or 400 if the request from client there has ereero 

fainally  create port to server listn the request on it and desiplay running messge for server on console .





 frontend part :

firstlly i  create a html fail and use cdn link in header and css stylesheet and before the end of body i add link js first of all i creat body ( header in simple way that cotain head and body paragraph after that in main we use css grid i preffer use it because  this  three card (total,count,heighest )with design margin or badding this is full ready structure of card so this batter than card bootstrap(ccard itself it design by bootstrap class but the order for three card i use th css grid) and use speisific class for it 
for add or post request we should create a form so the user can inserte a new info via it we creat form user bootstrap with spescific class to built it and after that we add the filter category bootstarp icon  used for it and for table we use the bootstarp responseive to view it in any phone tablet with any size and table design for bootstrap class class="table table-bordered table-striped table-hover"
in footer i use a simple bootstarp class agin that desiplay the &copy right statment .


in css fail (cascadind style sheet ) we design the color ,text,background,badding .margin ext.for body footer ,header table .

js fail :
in it firstlly  we check if the fail js is runng or not and view messge in console 
after that we fetch url(endpoint ,port 3-000)link that come from frontend and want to go the server with same endpoint and port 
at first we use alert showServerError  to show  messge if server offline or that its reeor on it we create asnyn/await function fetch (URL ) to check if the server is runnig or not and if there was response.ok (200) return server online else invoke the  function alert messge showServerError  

so at the begging of fail js i invoked the function that check if the server is run or offline (checkServerConnection)
after that we creat for evry http request fetch at first 
 
( fetchAPI for GETmethod) 
 for get http request we creat  asyn/await function fetchexpensses 
create vairable to load the response from fetch (url )( to go the server and the server convert it from json to js to use it and appllaid  prooccess to querery in db and return res.result after convert it to json to frotend to display it in DOM maniupulation (beacuse the data move in json string via network )) we user waite twic one to check about promis from ural if there was promis .result(response.ok--200)
and return the response.json (the result come from server and convrt it tojavascript to use it in this code and displayexpensses dataa and DOM/html  )
if the promis.reject show erroe 
the second await usess for check response.json (body message )
if it true or not (shoe message error) 

after that we create function for CALCULATE STATISTICS that caluate total ,count and heighest 

for filter expensses use a simple function that return if all return all or spcific return spesefic category as food .transport exc.

FOR deisplay expensses we use DOM manupulation and acssess the class i alread bulit it in html after i acssess it we edit the text innerhtml and add anew element (tableBody.appendChild(row) and use foreach to loop if there was anew row with there index ) and add design ,button ,icon on it to display in html for user .

 . ADD EXPENSE - POST:
 use dom to acsses form class in html and get the new value from it and applaied the vaildetion ont it if there was eroor in date in is empptiy and so on 
after that we create obj from expensses that hold the new value and after we created asyn/awit fetch addexpensses function (expensess) we throw the obj expensses that hold new vaild value via url in javascript languge )so we should convert it from javascript to json string to send it to server (JSON.stringify(expense))and we determind the method post (create)and theheader in body json we send it to server to applay the proccess and add new value in DB  ansd send res.json (result.row) to frontend so  if we get response.json  return data   if no rejected return  message Failed to add expense)

and we  add button design submitBtn.textContent = "Submit New Expense" for subimted the vaule   ,in DOM appear  the meaasge alert ;  other subimted reeor message✅ Expense added successfully! and invoked the loadedate function ( this function fetch( url) that  get all Db from server and update the calucaltion function total,count update the data inner it and display table via  filter function  displayExpenses(filteredExpenses)) to display the table with new row from database  other appear erroe.



// 6. UPDATE EXPENSE - PUT
firt i created function that get the id row with the olad info by function editExpense(id) and if no return 404 rrror("Expense not found)
if found it we ask uer to edite new value by prompt new mount new food exc  and applaied the validwation on new value after that we created expenses update  obj that hold the new vlue
and throw this obj in updateExpense that taken th id and expensses obj(new data )
send it in fetch function to server after convert it to json (JSON.stringify(expense)) with method PUT and header this json in body 
the server recive the http request with the same pot and endpint convert it tp js languge to apllay proccses(update DB) and return the value to frotend after convert to json 
if there was no promis.reject return error anotherwise response.json(data) and check on messahge body intrnal it if faild return (Failed to update expense) or not return data 
after invoked the updateexpensses we return data sucssfully with alert message    alert("✅ Expense updated successfully!"); and invoked the get http to get all table in database with new edite to deispaly to user in function loaddata()
if there was error rturn  with diasplay alert("❌ Failed to update expense."); and already we add button design in function displayExpenses.


// 7. DELETE EXPENSE - DELETE:
 create confirmDelete function this function when user preess button tha already add in function displayExpenses. apper message to confirm delete this id 
ife yes invoked performDelete (ID)
 performDelete :  this function invoked the deltexpenses(id) - the function send url with id and method delete and header json in body to server and server  convert it to js (app.use(express.json())) applaied the proscces update  DB and return res.result to frotend after that frontend check if there was promis.reject return erro or promis response return response.json to converti it to js and sent it to deisplay function to veiw via dom manuplaution )
 back to performDelete  if there was resulkt successful shoe alert  alert('✅ Expense deleted successfully!');
no data show alert alert('❌ Error: ' + result.error).and we invoked the loaddatafunction that (get the all tabel with new data updataed or delted from server  to shhow it via deisplay ).


After the HTML/DOM is fully loaded and ready, we set today's date, update the data when the user selects a category, and load the data when the page opens.


Automatically reloads the data every 5 seconds.

I added a Dark Mode button in HTML using Bootstrap styling. In JavaScript, I access the button through the DOM using its ID, then use an event listener for the click event to toggle the dark-mode class on the body. CSS then changes the page from Light Mode to Dark Mode.
toggle() = add if missing, remove if exists.


 DEMO LINKDRIVE:
https://drive.google.com/file/d/1B1UD625X8rh40vETyfVPWWJqIXeaveW6/view?usp=drive_link




