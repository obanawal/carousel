class Carousel extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      productList : [],
      filteredProductList: [],
      currentImageIndex: null
    };
  }
  
  componentDidMount() {
    let that = this;
    $.getJSON('https://api.myjson.com/bins/husm2', function(response) {
      // alert(response);
      // that.productList = response.products;
      that.setState({
        filteredProductList: response.products,
        productList : response.products,
        currentImageIndex: 0
      })
    });
  }
  
  previousSlide = () =>  {
    const lastIndex = this.state.filteredProductList.length - 1;
    const { currentImageIndex } = this.state;
    const shouldResetIndex = currentImageIndex === 0;
    const index =  shouldResetIndex ? lastIndex : currentImageIndex - 1;
    
    this.setState({
      currentImageIndex: index
    });
  }
  
  nextSlide =  ()  => {
    const lastIndex = this.state.filteredProductList.length - 1;
    const { currentImageIndex } = this.state;
    const shouldResetIndex = currentImageIndex === lastIndex;
    const index =  shouldResetIndex ? 0 : currentImageIndex + 1;

    this.setState({
      currentImageIndex: index
    });
  }
  
  filterProducts = (values) => {
    console.log(values);
    let temp = this.state.productList.filter(e => values.includes(e.productType));
    this.setState({
      filteredProductList : temp,
      currentImageIndex: 0
    })
    
  }
  
  render () {
    const showProducts = this.state.filteredProductList.length > 0;
    return (
      <div className="productCarousal">
        <div className="filter">
        <FilterCarousel submitClicked={this.filterProducts}> </FilterCarousel>
        </div>
      {showProducts &&
      <div className="carousel">
        <Arrow direction="left" clickFunction={ this.previousSlide } glyph="&#9664;"  product={ this.state.filteredProductList[this.state.currentImageIndex -1 ] }/>
        <ImageSlide product={ this.state.filteredProductList[this.state.currentImageIndex] } />
        <Arrow direction="right" clickFunction={ this.nextSlide } glyph="&#9654;"  product={ this.state.filteredProductList[this.state.currentImageIndex + 1] }/>
      </div>
      }
        </div>
    );
  }
};

class  FilterCarousel extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      filteredvalues : ["food",'medicine']
    };
  }
  
  submitClicked = () =>  {
    this.props.submitClicked(this.state.filteredvalues);
  }
  
  handleChange = (event) =>  {
    this.setState({filteredvalues: Array.from(event.target.selectedOptions, (item) => item.value)});
  }
  
  render (){
     return (
    <div>Filter Products
        <select multiple={true} value={this.state.filteredvalues} onChange={this.handleChange}> 
          <option value="food">Food</option>
           <option value="medicine">Medicine</option>
        </select>
        
        <input type="submit" value="Submit" onClick={this.submitClicked} /> 
      </div>
      
      )
    
  }
    
   
      
  
};

const Arrow = ({ direction, clickFunction, glyph, product }) => {
  console.log(product);
  let sideProduct;
  if(product != undefined){
    const styles = {
      backgroundImage: `url(${product.url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
    sideProduct = <div className="image-side" style={styles}/> 
  }
  return (
    <div>
      {sideProduct}
      <div 
        className={ `slide-arrow ${direction}` } 
        onClick={ clickFunction }>
        { glyph } 
      </div>
    </div>
)};

const ImageSlide = ({ product }) => {
  const styles = {
    backgroundImage: `url(${product.url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };
  
  return (
    <div className="image-slide">
      <div className="title">{product.name}</div>
      <div className="price">{product.price}</div>
    <div className="image-section" style={styles}/> 
      
      </div>
  );
}

ReactDOM.render(
  <Carousel />,
  document.getElementById('container')
);
