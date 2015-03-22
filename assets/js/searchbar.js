require(["jquery", "underscore"], function ($, _){
  $(function() {
      console.log('in searchbar.js');

      var Post = React.createClass({

      render: function(){
        return (
          <li className={this.props.is_selected}> 
            <a href= {this.props.filename}>
            <div className = "row">
              <div className="large-3 columns">
                <img src={this.props.img}/>
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
        //enter
        if(e.keyCode=='13'){
          var count = 0;
          var cursor = this.state.cursor;
          var the_post = this.props.data.filter(function(post){
            var bool = cursor == count;
            count+=1;
            return bool;
          });
          var post_title = the_post[0].filename;
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
        console.log(post.filename);
        return (
          <Post title={post.title} filename={post.filename} img={post.image} keywords={post.keywords} is_selected={is_selected}/>
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
            console.log(query_text);
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

      get_filt_data: function(query_text){
        var filt_data = this.props.data.filter(function(post){

          var boolwords = post.keywords.map(function(word){
            return word.toLowerCase().indexOf(query_text)!=-1
          });

          return (
            post.filename.toLowerCase().indexOf(query_text)!=-1 ||
            _.some(boolwords)
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
          <div id="search-box">
            <SearchBar update_searchbox={this.update_state} query={this.state.query} />
            <PostList data={this.state.filtered_data} query={this.state.query} />
          </div>
        );
      }

    });
  
    
    React.render(
      <SearchBox data={blog_data}/>,
      document.getElementById('searchbar')
    );



  });
});