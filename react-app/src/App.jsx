import React from "react";
import Lists from "./Lists";
import CreateList from "./CreateList";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            alldata: [],
            singledata: {
                _id: "",
                id: -1,
                title: "",
                author: "",
            },
        };
    }

    componentDidMount() {
        fetch("http://localhost:8000/api/books")
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                this.setState({
                    loading: false,
                    alldata: result,
                });
            })
            .catch(console.log);
    }

    createList = () => {
        fetch("http://localhost:8000/api/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state.singledata),
        })
            .then(() => {
                this.setState({
                    singledata: {
                        id: this.state.alldata.id + 1,
                        title: "",
                        author: "",
                    },
                });
                window.location.reload();
            })

            .catch(console.log);
    };

    updateList = (id) => {
        this.state.singledata._id = id;

        fetch("http://localhost:8000/api/book", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state.singledata),
        })
            .then(() => {
                this.setState({
                    singledata: {
                        _id: "",
                        title: "",
                        author: "",
                    },
                });
                this.getLists();
            })

            .catch(console.log);
    };

    deleteList = (id) => {
        fetch("http://localhost:8000/api/book/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state.singledata),
        })
            .then(() => {
                this.setState({
                    singledata: {
                        title: "",
                        author: "",
                    },
                });
                window.location.reload();
            })

            .catch(console.log);
    };

    handleChange = (event) => {
        console.log(event.target.value);
        let title = this.state.singledata.title;
        let author = this.state.singledata.author;

        if (event.target.name == "title") {
            title = event.target.value;
        } else {
            author = event.target.value;
        }

        this.setState({
            singledata: {
                id: this.state.alldata.length + 1,
                title: title,
                author: author,
            },
        });
    };

    render() {
        const listTable = this.state.loading ? (
            <span>Loading Data.....Please be patience.</span>
        ) : (
            <Lists
                alldata={this.state.alldata}
                singledata={this.state.singledata}
                handleChange={this.handleChange}
                updateList={this.updateList}
                deleteList={this.deleteList}
            ></Lists>
        );
        return (
            <div>
                <span>
                    <CreateList
                        singledata={this.state.singledata}
                        handleChange={this.handleChange}
                        createList={this.createList}
                    />
                </span>
                {listTable}
            </div>
        );
    }
}

export default App;
