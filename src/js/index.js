import React from 'react';
import ReactDOM from 'react-dom';
import { NavBar } from './NavBar.js';

let wishlist;
let dataFetched;
let searchData;

class Wishlist extends React.Component {
    //Create table items. Used by generateList, addItemToWishlist, and deleteItem functions
    createWishListTable (data) {
          wishlist = data.map((item, index) => {
          return (
            <tr scope="row" key={index}>
              <td>
                <img className="rounded-circle" src={item.image}/>
              </td>
              <td>
                <div className="font-weight-bold">
                  {item.name}
                </div>
                <small>
                  {item.subTitle}
                </small>
              </td>
              <td>${item.standardPrice}</td>
              <td>{item.rating}</td>
              <td>{item.reviews}</td>
              <td onClick={this.deleteItem.bind(this, item)}>
                <a className="font-weight-bold text-danger mx-auto">
                  X
                </a>
              </td>
            </tr>
          )
        })
        return wishlist;
    }

    //Load list as is from the db
    generateList() {
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
        this.forceUpdate();
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
                  dataFetched = data.products;
                  searchData = data.products.map((item, index) => {
                    return (
                      <option key={index} value={item.suggestion} data-load={item}>
                        {item.suggestion} - {item.subTitle} &ensp; ${item.standardPrice}
                      </option> 
                    )
                  })
                  this.forceUpdate();

                }.bind(this),
                error: function(xhr, status, err) {
                  console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
            this.forceUpdate();
        }else{
            this.setState({value: ""});
        }
    }

    //Add item to wishlist 
    addItemToWishlist(event) {
        let itemDetailsSelected = _.filter(dataFetched, (item) => {
            return item.suggestion === this.state.value
        })

        if(itemDetailsSelected.length !== 0){
            event.preventDefault();
            $.ajax({
                type: "POST",
                url: "http://localhost:3000/addWishItem",
                dataType: 'json',
                data: {
                    user_id: 65,
                    item: itemDetailsSelected[0]
                },
                success: function(data) {
                    wishlist = this.createWishListTable(data)
                    this.forceUpdate();
                    this.inputFieldString(null);
                    return wishlist;
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        }
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
              return wishlist;
          }.bind(this),
          error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
          }.bind(this)
      });
    }

    render() {
      return (
        <div>
          <div className="card">
            <div className="card-body">
              <form className="form-group" onSubmit={this.addItemToWishlist}>
                <label>Add an item to your wishlist:</label>
                <input list="searchItems" name="search" className="form-control" type="text" value={this.state.value} maxLength="50" required onChange={this.inputFieldString} />
                <datalist id="searchItems">
                  {searchData}
                </datalist>
                <br />
                <div>
                  <input className="btn btn-info float-right" type="submit" value="Submit" />
                </div>
              </form>
            </div>
          </div>
          <br />
          <button className="btn btn-outline-success" onClick={this.generateList.bind(this)}>
            Get Wishlist
          </button>
          <br />
          <br />
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col" align="center">Image</th>
                <th scope="col">Name</th>
                <th scope="col">Price</th>
                <th scope="col">Rating</th>
                <th scope="col">Reviews</th>
                <th scope="col" align="center">Remove</th>
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

ReactDOM.render(<Wishlist />, document.getElementById('app'))