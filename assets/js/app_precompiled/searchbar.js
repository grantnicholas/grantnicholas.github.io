require(["jquery", "underscore"], function ($, _) {
  $(function() {
      console.log('in searchbar.js');

      var Post = React.createClass({

      render: function() {

          return (

            <li className={this.props.is_selected}> 
              <a href= {this.props.url}>
              <div className = "row">
                <div className="large-3 columns">
                    <img className={this.props.img ===undefined ? 'hide' : ''} src={this.props.img}/>
                </div>
                <div className="large-9 columns">
                  {this.props.title}
                </div>
              </div>
              </a>
            </li>
          );
      }

    });

    var PostList = React.createClass({
      getInitialState:function(){
        return{
            cursor: 0
        }
      },

      componentDidMount: function(){
        $('#search-bar').on('keydown', this.handleKeyPress);
      },

      handleKeyPress: function(e) {
        if(e.keyCode=='13' || e.keyCode=='38' || e.keyCode=='40'){
          //enter
          if(e.keyCode=='13'){
            var post_title = this.props.data[this.state.cursor].url;
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
        }
        else{
          this.setState({cursor : 0});
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
      },

      set_cursor_up: function(){
        var len = this.props.data.length-1;

        if(this.state.cursor!=0){
          this.setState({cursor : this.state.cursor-1})
        }
        else{
          this.setState({cursor : len})
        }
      },

      render: function(){
      var count = 0
      var outer_this = this;
      var posts = this.props.data.map(function(post){
        var is_selected = outer_this.state.cursor == count ? "is_selected" : "";
        count+=1;
        return (
          <Post title={post.title} url={post.url} img={post.image} keywords={post.keywords} is_selected={is_selected}/>
        );
      });

        return(
          <ul id="search-items">
            {posts}
          </ul>
        );
      }

    });

    var SearchBar = React.createClass({
        update_search:function(){
            var query_text=this.refs.search_input.getDOMNode().value;
            this.props.update_searchbox(query_text);
        },

        render:function(){
            return <input type="text" 
                    id="search-bar" 
                    ref="search_input" 
                    placeholder="Search for a post, title, or keyword" 
                    required="required" 
                    value={this.props.query}
                    onChange={this.update_search}/>
        }

    });

    var SearchBox = React.createClass({

      getInitialState:function(){
        return{
            query_text: '',
            data : [],
            filtered_data: []
        }
      },

      /*
      The search algorithm is an approximation of fuzzy search. 
      -split the query text into query words 
      -look through every post and filter out data that does not meet the minimum criteria for matching the query words
      -the min criteria for post matching is that every query word is represented in some place in the keywords of the post
      -keywords of the post are decided by the python program kwargs.py
      */

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
          <div id="search-box">
            <SearchBar update_searchbox={this.update_state} query={this.state.query} />
            <PostList data={this.state.filtered_data} query={this.state.query} />
          </div>
        );
      }

    });
  
    
    React.render(
      <SearchBox data={blog_data}/>,
      document.getElementById('search-container')
    );



  });
});