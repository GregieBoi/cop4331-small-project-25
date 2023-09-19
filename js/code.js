const urlBase = 'http://cop4331group25.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

				if( userId < 1 )
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "contact.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegister()
{
	userId = "";

	let firstName = document.getElementById("regFirst").value;
	let lastName = document.getElementById("regLast").value;

	let login = document.getElementById("regName").value;
	let password = document.getElementById("regPassword").value;
//	var hash = md5( password );

	document.getElementById("registerResult").innerHTML = "";

	let tmp = {firstName:firstName,lastName:lastName,login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 500)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

				if( userId == "" )
				{
					document.getElementById("registerResult").innerHTML = "Username is not available";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "contact.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	/*
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
	*/

	document.cookie = "firstName=" + firstName;
	document.cookie = "lastName=" + lastName;
	document.cookie = "userId=" + userId;

}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(";");
	for(var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}

}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	let newContactFirst = document.getElementById("contactFirst").value;
	let newContactLast  = document.getElementById("contactLast").value;
	let newContactEmail = document.getElementById("contactEmail").value;
	let newContactPhone = document.getElementById("contactPhone").value;

	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {firstName:newContactFirst,lastName:newContactLast,phone:newContactPhone,email:newContactEmail,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

}

function searchContact()
{

	var Parent = document.getElementById("searchResultTable");
	while(Parent.hasChildNodes())
	{
	   Parent.removeChild(Parent.firstChild);
	}

	let srch = document.getElementById("searchQuery").value;
	document.getElementById("contactSearchResult").innerHTML = "";

	let tmp = {userId:userId, search:srch};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				let contacts = jsonObject.results;
				// Get the container element where the table will be inserted
				let searchResultTable = document.getElementById("searchResultTable");

				// Create the table element
				let table = document.createElement("table");

				// Get the keys (column names) of the first object in the JSON data
				let cols = [" ", "First Name", "Last Name", "Phone Number", "E-mail Address", " "];

				// Create the header element
        let thead = document.createElement("thead");
        let tr = document.createElement("tr");

				// Loop through the column names and create header cells
				cols.forEach((item) => {
					 let th = document.createElement("th");
					 th.innerText = item; // Set the column name as the text of the header cell
					 tr.appendChild(th); // Append the header cell to the header row
				 });
				 thead.appendChild(tr); // Append the header row to the header
         table.append(tr) // Append the header to the table

				 // Loop through the JSON data and create table rows
				 contacts.forEach((item) => {
					 const editButton = document.createElement('button');
					 const deleteButton = document.createElement('button');
					 editButton.innerText = "Edit";
					 editButton.setAttribute("id", "" + item.contactId + "");
					 editButton.onclick = function(){openEdit(item.contactId, item.firstName, item.lastName, item.phone, item.email)};
					 deleteButton.innerText = "Delete";
					 deleteButton.setAttribute("id", "" + item.contactId + "");
					 deleteButton.onclick = function(){deleteContact(item.contactId)};
					 let tr = document.createElement("tr");

					 // Get the values of the current object in the JSON data
					 let vals = Object.values(item);

					 // Loop through the values and create table cells
					 vals.forEach((elem) => {
							let td = document.createElement("td");
							td.innerText = elem; // Set the value as the text of the table cell
							tr.appendChild(td); // Append the table cell to the table row

					 });
					 tr.appendChild(editButton);
					 tr.appendChild(deleteButton);
					 table.appendChild(tr); // Append the table row to the table
				});
         searchResultTable.appendChild(table) // Append the table to the container element
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}

}

function deleteContact(contactId)
{

	let tmp = {contactId:contactId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactDeleteResult").innerHTML = err.message;
	}

}

function openEdit(contactId, ogFirst, ogLast, ogPhone, ogEmail)
{

	popup = document.getElementById("popupFormEdit");
	
	document.getElementById("contactEditFirst").setAttribute("name", contactId);
	document.getElementById("contactEditFirst").setAttribute("value", ogFirst);
	document.getElementById("contactEditLast").setAttribute("value", ogLast);
	document.getElementById("contactEditPhone").setAttribute("value", ogPhone);
	document.getElementById("contactEditEmail").setAttribute("value", ogEmail);

	popup.style = "block";

}

function editContact()
{

	let contactId = document.getElementById("contactEditFirst").name;
	let editFirst = document.getElementById("contactEditFirst").value;
	let editLast  = document.getElementById("contactEditLast").value;
	let editPhone = document.getElementById("contactEditPhone").value;
	let editEmail = document.getElementById("contactEditEmail").value;

	let tmp = {userId:userId,contactId:contactId,firstName:editFirst,lastName:editLast,phone:editPhone,email:editEmail};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/EditContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactEditResult").innerHTML = "Contact has been updated";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactEditResult").innerHTML = err.message;
	}

}
