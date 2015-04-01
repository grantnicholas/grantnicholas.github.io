require(["jquery", "underscore"], function ($, _){
  $(function() {
      console.log('in searchbar.js');

      var Post = React.createClass({displayName: "Post",

      render: function(){
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
      getInitialState:function(){
        return{
            cursor: 0
        }
      },

      componentDidMount: function(){
        $('#search-bar').on('keydown', this.handleKeyPress);
      },

      handleKeyPress: function(e) {
        //enter
        if(e.keyCode=='13'){
          var count = 0;
          var cursor = this.state.cursor;
          var the_post = this.props.data.filter(function(post){
            var bool = cursor == count;
            count+=1;
            return bool;
          });
          var post_title = the_post[0].url;
          location.href = post_title;
        }
        //up
        if(e.keyCode=='38'){
          this.set_cursor_up();
        }
        //down
        if(e.keyCode=='40'){
          this.set_cursor_down();
        }
      },

      set_cursor_down: function(){
        var len = this.props.data.length-1;

        if(this.state.cursor!=len){
          this.setState({cursor : this.state.cursor+1})
        }
        else{
          this.setState({cursor : 0})
        }
        console.log(this.state.cursor);
      },

      set_cursor_up: function(){
        var len = this.props.data.length-1;

        if(this.state.cursor!=0){
          this.setState({cursor : this.state.cursor-1})
        }
        else{
          this.setState({cursor : len})
        }
        console.log(this.state.cursor);
      },

      render: function(){
      var count = 0
      var outer_this = this;
      var posts = this.props.data.map(function(post){
        var is_selected = outer_this.state.cursor == count ? "is_selected" : "";
        count+=1;
        console.log(is_selected);
        console.log(post.url);
        return (
          React.createElement(Post, {title: post.title, filename: post.filename, url: post.url, img: post.image, keywords: post.keywords, is_selected: is_selected})
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
            console.log(query_text);
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

      get_filt_data: function(query_text){
        lower_text = query_text.toLowerCase();
        query_words = lower_text.split(' ').filter(function(word){
          return word !='' && word !=' ';
        });

        var filt_data = this.props.data.filter(function(post){

          var boolwords = post.keywords.map(function(word){
            return word.indexOf(lower_text)!=-1
          });

          var boolwords2 = query_words.map(function(word){
            // return _.contains(post.keywords, word)
            return _.some(
              post.keywords.map(function(kword){
                return kword.indexOf(word)!=-1
              })
            )
          });

          return (
            post.filename.indexOf(lower_text)!=-1 ||
            _.some(boolwords) || 
            _.some(boolwords2)
          )
        });

        var top_filt_data = _.first(filt_data, 5)
        return top_filt_data;
      },

      set_filt_data: function(filt_data){
        this.setState({filtered_data: filt_data})
      },

      set_query_text: function(q_text){
        this.setState({query_text: q_text})
      },

      update_state: function(query_text){
        this.set_query_text(query_text);
        this.set_filt_data(this.get_filt_data(query_text));
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