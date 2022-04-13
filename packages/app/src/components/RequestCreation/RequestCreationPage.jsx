import React from 'react';
import M from 'materialize-css';
import ItemRequest from './ItemRequest';
import RequestedItems from './RequestedItems';
import TextField from '../Common/TextField';
import AuthContext from '../../context/AuthContext';

class RequestCreationPage extends React.Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            requestCreator: {},

            clientId: '',
            location: '',
            itemsInRequest: [],

            requestStatus: 'NEW'
        };

        this.handleItemAdded = this.handleItemAdded.bind(this);
        this.submitRequest = this.submitRequest.bind(this);
    }

    componentDidMount() {
        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }

    handleChange = (evt) => {
        const { id, value } = evt.target;
        this.setState({
            [id]: value
        });
    };

    handleItemAdded(item) {
        // TODO: validate item before adding
        this.setState({
            itemsInRequest: this.state.itemsInRequest.concat([item])
        });
    }

    submitRequest() {
        const submittedBy = this.context.contextUser._id;
        var items = this.state.itemsInRequest;
        for (var i = 0; i < items.length; i++) {
            items[i] = {
                clientId: this.state.clientId,
                submittedBy: submittedBy,
                urgency: 'survival',
                location: 'Rainier House',
                status: 'active',
                numberOfItems: items[i].count,
                note: items[i].notes,
                itemCategory: items[i].category,
                name: items[i].itemType,
                size: items[i].size,
                gender: genderMap[items[i].gender]
            };
        }

        let body = {
            clientId: this.state.clientId,
            submittedBy: submittedBy,
            items: items
        };
        fetch('http://localhost:3000/api/clientrequests', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body)
        })
            .then(function (response) {
                console.log(response);
                if (response.ok && response.status === 200) {
                    return response.json();
                } else {
                    return Promise.reject({ message: 'err' });
                }
            })
            .then(function (data) {
                if (data.success) {
                    M.toast({ html: 'Your request has been created' });
                    // TODO: navigate to inbox
                } else {
                    M.toast({ html: 'Error' });
                }
                console.log(data);
            })
            .catch(function (err) {
                // M.toast({ html: 'Error' });
                console.log(err);
            });
    }

    render() {
        return (
            <div className="container">
                <div className="card-panel">
                    <h5 className="center-align">New Client Request</h5>

                    <div className="row">
                        <div className="col s6">
                            <TextField
                                label="Client Id"
                                type="text"
                                name="clientId"
                                value={this.state.clientId}
                                handleChange={this.handleChange}
                            />
                        </div>
                        <div className="col s6">
                            <TextField
                                label="Client Location"
                                type="text"
                                name="location"
                                value={this.state.location}
                                handleChange={this.handleChange}
                            />
                        </div>
                    </div>
                    <ItemRequest onItemAdded={this.handleItemAdded} />

                    <RequestedItems items={this.state.itemsInRequest} />

                    <div className="card-action">
                        <a className="btn" href="#!" onClick={this.submitRequest}>
                            Submit Request
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

const genderMap = {
    Male: 'M',
    male: 'M',
    Female: 'F',
    female: 'F'
};

export default RequestCreationPage;
