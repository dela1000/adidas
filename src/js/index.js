import React from 'react';
import ReactDOM from 'react-dom';
import { NavBar } from './NavBar.js';

let wishlist;
let wishlistData;
let cardsData;

let pointer = {
  cursor:"pointer" 
}

class Wishlist extends React.Component {
    //Create table items. Used by loadList, addItemToWishlist, and deleteItem functions
    createWishListTable (data) {
          wishlistData = data;
          wishlist = data.map((item, index) => {
          return (
            <tr scope="row" key={index}>
              <td>
                <center>
                  <a style={pointer} href={item.url} target="_blank">
                    <img className="rounded-circle" src={item.image}/>
                  </a>
                </center>
              </td>
              <td>
                <div className="font-weight-bold text-secondary">
                  {item.name}
                </div>
                <small>
                  {item.subTitle}
                </small>
              </td>
              <td>
                <center>
                  ${item.standardPrice}
                </center>
              </td>
              <td>
                <center>
                  {item.rating}
                </center>
              </td>
              <td>
                <center>
                  {item.reviews}
                </center>
              </td>
              <td onClick={this.deleteItem.bind(this, item)} align="center">
                <a className="font-weight-bold text-danger" style={pointer}>
                  X
                </a>
              </td>
            </tr>
          )
        })
        return wishlist;
    }

    //Load list as is from the db
    loadList() {
        $.ajax({
            url: "http://localhost:3000/retrieveWishlist",
            dataType: 'json',
            success: function(data) {
                wishlist = this.createWishListTable(data)
                this.forceUpdate();
                return wishlist;
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }

    //Input constructor
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.inputFieldString = this.inputFieldString.bind(this);
        this.addItemToWishlist = this.addItemToWishlist.bind(this);
    }

    //Retrieve dropdown selection options from Adidas Search API
    inputFieldString(event) {
        if(event){
            this.setState({value: event.target.value});
            $.ajax({
                url: "https://www.adidas.co.uk/api/suggestions/" + event.target.value,
                dataType: 'json',
                success: function(data) {
                    if(data.products.length){
                      cardsData = data.products.map((item, index) => {
                        return (
                          <div key={index} value={item.suggestion} className="col-sm-3 text-center" onClick={this.addItemToWishlist.bind(this, item)}>
                            <div className="card-body" style={pointer}>
                              <div>
                                <img  className="rounded-circle" src={item.image}/>
                              </div>
                              <div className="font-weight-bold">
                                {item.suggestion}
                              </div>
                              <div>
                                <small>
                                  {item.subTitle}
                                </small>
                              </div>
                              <div>
                                ${item.standardPrice}
                              </div>
                            </div>
                          </div> 
                        )
                      })
                    } else {
                        cardsData = emptyCards("This search does not find any items")
                    }
                    this.forceUpdate();
                }.bind(this),
                error: function(xhr, status, err) {
                  cardsData = null;
                  this.forceUpdate();
                  console.error("ERROR", this.props.url, status, err.toString());
                }.bind(this)
            });
            this.forceUpdate();
        }else{
            this.setState({value: ""});
        }
    }

    //Add item to wishlist 
    addItemToWishlist(item) {

      var match = _.filter(wishlistData, _.matches({name: item.suggestion, url: item.url, image: item.image}));

      if(!_.isEmpty(match)){

        cardsData = emptyCards("This item is already on your wishlist")
        
        this.inputFieldString(null);
        this.forceUpdate();
        return;
      }

      $.ajax({
          type: "POST",
          url: "http://localhost:3000/addWishItem",
          dataType: 'json',
          data: {
              user_id: 65,
              item: item
          },
          success: function(data) {
              wishlist = this.createWishListTable(data)
              cardsData = null;
              this.forceUpdate();
              this.inputFieldString(null);
          }.bind(this),
          error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
          }.bind(this)
      });
    }

    //Delete item from wishlist
    deleteItem (item) {
      $.ajax({
          type: "POST",
          url: "http://localhost:3000/removeWishItem",
          dataType: 'json',
          data: {
              id: item.id,
              name: item.name
          },
          success: function(data) {
              wishlist = this.createWishListTable(data)
              this.forceUpdate();
              this.inputFieldString(null);
          }.bind(this),
          error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
          }.bind(this)
      });
    }

    render() {
      if(!wishlistData){
        this.loadList();
      }
      return (
        <div>
          <div className="card">
            <div className="card-body">
                <label>Add an item to your wishlist:</label>
                <input list="searchItems" name="search" className="form-control" type="text" autoComplete="off" value={this.state.value} maxLength="50" required onChange={this.inputFieldString} />
                <br />
                <div className="row">
                  {cardsData}
                </div>
            </div>
          </div>
          <br />
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">
                  <center>Image</center>
                </th>
                <th scope="col">
                  <center>Name</center>
                </th>
                <th scope="col">
                  <center>Price</center>
                </th>
                <th scope="col">
                  <center>Rating</center>
                </th>
                <th scope="col">
                  <center>Reviews</center>
                </th>
                <th scope="col">
                  <center>Remove</center>
                </th>
              </tr>
            </thead>
            <tbody>
              {wishlist}
            </tbody>
          </table>
          <small className="form-text text-muted float-right">Click <span className="font-weight-bold text-danger">X</span> to remove item</small>
        </div>
      )
    }
};

// Helper function
let emptyCards = (text) => {
    let input = [{text: text}]
    let data = input.map((item, index) => {
        return (
          <div key={index} className="col text-center">
            {item.text}
          </div>
        )
    })
    return data;
}


ReactDOM.render(<Wishlist />, document.getElementById('app'))