import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
//import {v4 as uuid} from 'uuid'
import { connect } from 'react-redux';
import { getItems, deleteItem } from '../actions/itemActions';
import PropTypes from 'prop-types';

class ShoppingList extends Component {
    // state = {
    //     items: [
    //         { id: uuid(), name: 'Eggs'},
    //         { id: uuid(), name: 'Milk'},
    //         { id: uuid(), name: 'Steak'},
    //         { id: uuid(), name: 'Water'},
    //     ]
    // };

    //Life cycle method: The componentDidMount() method runs after the component output has been rendered to the DOM. 
    componentDidMount() {
        this.props.getItems();
    }

    onDeleteClick = (id) => {
        this.props.deleteItem(id);
    }

    render() {
        const { items } = this.props.item; // destructuring, pulling items from this.props
        return(
            <Container>
                {/* <Button 
                    color="dark" 
                    style={{marginBottom: '2rem'}}
                    onClick={() => {
                        const name = prompt('Enter Item');
                        if(name) {//check if filled
                            this.setState(state => ({
                                items: [...state.items, { id: uuid(), name}]
                            }));
                        }
                    }}
                >Add Item</Button> */}

                <ListGroup>
                    <TransitionGroup className="shopping-list">
                        {items.map(({ _id, name }) => (
                            <CSSTransition key={_id} timeout={500} classNames="fade">
                                <ListGroupItem>
                                    <Button 
                                        className="remove-btn" 
                                        color="danger" 
                                        size="sm"
                                        onClick={this.onDeleteClick.bind(this, _id)}
                                    >&times;</Button>
                                    {name}
                                </ListGroupItem>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>

                </ListGroup>
            </Container>
        );
    }
}

ShoppingList.propTypes = {
    getItems: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired
}

//=> () is an implicit return equivalent to => { return ()}
//const add = ( a, b ) => ( a + b )
//Is equivalent to
//const add = ( a, b ) => { return a+b; }
const mapStateToProp = (state) => ({  //<-- implicit return
    item: state.item
});//set to root reducer

export default connect(mapStateToProp, { getItems, deleteItem })(ShoppingList); //mapStateToProp-take item state to map to component property.