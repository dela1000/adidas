import React from 'react';
import ReactDOM from 'react-dom';


//In-line styles
let header = {
  backgroundColor: "black"
}

let logo = {
  width: "60%",
  height: "auto",
  paddingTop: "25px",
  marginLeft: "50px"
}

let center = {
  paddingTop: "35px"
}

class NavBar extends React.Component {
  render() {
    return ( 
      <div style={header}>
        <div className="row">
          <div className="">
            <img style={logo} src="http://www.wingsuitfly.com/communities/2/004/011/323/392//images/4598600946_246x163.png" />
          </div>
          <div className="col-5" style={center}>
            <div>
              <h1 className=" text-white font-weight-bold">Wishlist</h1>
              <p className=" text-light font-italic">Adidas Coding Challenge</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
ReactDOM.render( <NavBar /> , document.getElementById('navbar'))