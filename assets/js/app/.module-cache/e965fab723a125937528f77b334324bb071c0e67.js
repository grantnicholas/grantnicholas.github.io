require(["jquery", "underscore"], function ($, _) {
  $(function() {
    console.log('in searchbar.js');

    var Post = React.createClass({displayName: "Post",

      render: function() {
          return (
            React.createElement("li", {className: this.props.is_selected}, 
              React.createElement("a", {href: this.props.url}, 
              React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "large-3 columns"}, 
                    React.createElement("img", {src: this.props.img})
                ), 
                React.createElement("div", {className: "large-9 columns"}, 
                  this.props.title
                )
              )
              )
            )
          );
      }

    });

    var PostList = React.createClass({displayName: "PostList",
      render: function(){
      var posts = this.props.data.map(function(post){
        return (
          React.createElement(Post, {title: post.title, url: post.url, img: post.image, keywords: post.keywords})
        );
      });

        return(
          React.createElement("ul", {id: "search-items"}, 
            posts
          )
        );
      }

    });

    var SearchBar = React.createClass({displayName: "SearchBar",
        update_search:function(){
            var query_text=this.refs.search_input.getDOMNode().value;
            this.props.update_searchbox(query_text);
        },

        render:function(){
            return React.createElement("input", {type: "text", 
                    id: "search-bar", 
                    ref: "search_input", 
                    placeholder: "Search for a post, title, or keyword", 
                    required: "required", 
                    value: this.props.query, 
                    onChange: this.update_search})
        }

    });

    var SearchBox = React.createClass({displayName: "SearchBox",

      getInitialState:function(){
        return{
            query_text: '',
            data : [],
            filtered_data: []
        }
      },

      get_filt_data: function(query_text, numdata){
        lower_text = query_text.toLowerCase();
        query_words = lower_text.split(' ').filter(function(word){
          return word !='' && word !=' ';
        });

        var filt_data = this.props.data.filter(function(post){


          var boolwords = query_words.map(function(word){
            return _.some(
              post.keywords.map(function(kword){
                return kword.indexOf(word)!=-1
              })
            );
          });

          return ( 
            _.all(boolwords)
          )

        });

        var top_filt_data = _.first(filt_data, numdata)
        return top_filt_data;
      },

      set_filt_data: function(filt_data){
        this.setState({filtered_data: filt_data})
      },

      set_query_text: function(q_text){
        this.setState({query_text: q_text})
      },

      /*
      Due to the one-way data flow of React, we need to a way to modify the searchbox and update its state from "downstream".
      To do this we pass a function as a prop that lets us modify the state of the searchbox object. 
      */

      update_state: function(query_text){
        this.set_query_text(query_text);
        this.set_filt_data(
          this.get_filt_data(query_text, 5)
        );
      },

      render: function(){
        return(
          React.createElement("div", {id: "search-box"}, 
            React.createElement(SearchBar, {update_searchbox: this.update_state, query: this.state.query}), 
            React.createElement(PostList, {data: this.state.filtered_data, query: this.state.query})
          )
        );
      }

    });

  
    React.render(
      React.createElement(SearchBox, {data: blog_data}),
      document.getElementById('search-container')
    );


  });
});