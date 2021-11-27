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
        this.getLists();
    }

    getLists() {
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

    updateList = (event, id) => {
        this.state.singledata._id = id;

        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = this.state.alldata.filter((book) => book._id == id)[0];
        item[name] = value;
        console.log(event, item, name, value);

        let books = this.state.alldata;

        books.forEach((book) => {
            if (book._id == id) {
                book[name] = value;
            }
        });

        fetch("http://localhost:8000/api/book", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
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

    handleChange = (event, id) => {
        console.log(event.target.value);
        let title = this.state.singledata.title;
        let author = this.state.singledata.author;

        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = this.state.alldata.filter((book) => book._id == id)[0];
        item[name] = value;

        let books = this.state.alldata;
        books.forEach((book) => {
            if (book._id == id) {
                book[name] = value;
            }
        });

        console.log(event, item, name, value);

        this.setState({
            alldata: books,
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
