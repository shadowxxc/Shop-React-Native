/**
 * ShopReactNative
 *
 * @author Tony Wong
 * @date 2016-09-11
 * @email 908601756@qq.com
 * @copyright Copyright © 2016 EleTeam
 * @license The MIT License (MIT)
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    ListView,
    RefreshControl,
    Image,
    InteractionManager,
    Alert
} from 'react-native';
import {cartView} from '../actions/cartActions';
import Common from '../common/constants';
import Header from '../components/Header';
import ProductContainer from '../containers/ProductContainer';
import Loading from '../components/Loading';

let isLoading = true;

export default class CartPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                getRowData: (data, sectionID, rowID) => {
                    return data[sectionID][rowID];
                },
                getSectionHeaderData: (data, sectionID) => {
                    return data[sectionID];
                },
                rowHasChanged: (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged: (section1, section2) => section1 !== section2,
            })
        }
    }

    componentDidMount() {
        // 交互管理器在任意交互/动画完成之后，允许安排长期的运行工作. 在所有交互都完成之后安排一个函数来运行。
        InteractionManager.runAfterInteractions(() => {
            const {dispatch} = this.props;
            dispatch(cartView());
        });
    }

    render() {
        const {cartReducer, isShowNavigator} = this.props;
        let cartItems = cartReducer.cartItems;

        return (
            <View style={styles.container}>
                {isShowNavigator ?
                    <Header
                        leftIcon='angle-left'
                        leftIconAction={()=>this.props.navigator.pop()}
                        title='购物车'
                    /> :
                    <View style={styles.headerWrap}>
                        <Text style={styles.header}>购物车</Text>
                    </View>
                }
                {cartReducer.isLoading ?
                    <Loading /> :
                    <ListView
                        dataSource={this.state.dataSource.cloneWithRows(cartItems)}
                        renderRow={this._renderRow.bind(this)}
                        enableEmptySections={true}
                        style={{height: Common.window.height - 64}}
                    />
                }
            </View>
        )
    }

    _renderRow(cartItem, sectionID, rowID) {
        let product = cartItem.product;
        return (
            <TouchableOpacity onPress={this._onPressProduct.bind(this, product.id)}>
                <View style={styles.productItem}>
                    <Image
                        style={styles.productImage}
                        source={{uri: product.image_small}}
                    />
                    <View style={styles.productRight}>
                        <Text>{product.name}</Text>
                        <View style={{flexDirection:'row'}}>
                            <Text>￥{product.price}</Text>
                            <Text>￥{product.featured_price}</Text>
                        </View>
                        <Text>立减 ￥{product.price - product.featured_price}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    _onPressProduct(product_id) {
        // Alert.alert(product_id);
        InteractionManager.runAfterInteractions(() => {
            this.props.navigator.push({
                name: 'ProductContainer',
                component: ProductContainer,
                passProps: {...this.props, product_id:product_id}
            })
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerWrap: {
        alignItems: 'center',
        height: 44,
        backgroundColor: '#ff7419',
    },
    header: {
        color: '#fff',
        paddingTop: 22,
        fontSize: 17,
    },

    productItem: {
        height: 80,
        flexDirection:'row',
        padding: 15,
        marginBottom: 1,
        backgroundColor:'#fff',
    },
    productRight: {
        flexDirection:'column',
    },
    productImage: {
        width: 60,
        height: 60,
        marginRight: 15,
    },
    productPrice: {
        fontSize: 24,
        color: 'red',
    },
    productFeaturedPrice: {
        fontSize: 14,
        color: '#ddd',
    },
});