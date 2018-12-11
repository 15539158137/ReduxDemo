/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Alert, Text, View, Button, TextInput, TouchableOpacity, ScrollView} from 'react-native';

const CarSchema = {
    //optional 表示是否可以为空  primaryKey表示主键，但是他不会自增，需要自己来实现不重复。主键重复就不能保存进去
    //当参数没有default值时候，option设置为true表示可以为空
//当参数有default值时，option不管设置true和false都能插入进去，因为默认值是default的值
    name: 'Car',
    primaryKey: 'id',
    properties: {
        id: {type: 'int', default: 0, optional: true},
        make: 'string',
        model: 'string',
        miles: {type: 'int', default: 0},
        newData: {type: 'string', default: 'newData', optional: false}
    }
};

const UpdateCarSchema = {
    name: 'Car',
    primaryKey: 'id',
    properties: {
        id: {type: 'int', optional: true},
        make: 'string',
        model: 'string',
        miles: {type: 'int', default: 0},
        newData: {type: 'string', default: 'newData', optional: false}
    }
};


const PersonSchema = {
    name: 'Person',
    properties: {
        name: 'string',
        birthday: 'string',
        cars: 'Car[]',
        picture: 'string?'
    }
};
const Realm = require('realm');
import SaveUtil from './SaveUtil'

type Props = {};

const Dimensions = require('Dimensions'); //必须要写这一行，否则报错，无法找到这个变量
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;


export default class App extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {allDatas: [], model: '', currentVersion: 0};
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollView style={{width: ScreenWidth, height: ScreenHeight}}>
                    <View style={{}}>
                        <TouchableOpacity onPress={() => {
                            this.addDataToDB();
                        }} style={{

                            backgroundColor: 'gray',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: ScreenWidth,
                            height: 0.06 * ScreenHeight
                        }}>
                            <Text style={{fontSize: 17, color: 'black'}}>新增数据</Text>
                        </TouchableOpacity>
                        <TextInput onChangeText={(text) => {
                            this.setState((prevState) => ({model: text}), () => {
                            })
                        }} style={{
                            marginTop: 10,
                            width: ScreenWidth,
                            height: 0.07 * ScreenHeight,
                            borderRadius: 5,
                            borderWidth: 2,
                            borderColor: 'red',
                            color: 'black',
                        }}/>


                        <TouchableOpacity onPress={() => {
                            this.updateDB(0, this.state.model)
                        }} style={{
                            marginTop: 10,
                            backgroundColor: 'gray',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: ScreenWidth,
                            height: 0.06 * ScreenHeight
                        }}>
                            <Text style={{fontSize: 17, color: 'black'}}>点击修改id为0的</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.updateDBVersion();
                        }} style={{
                            marginTop: 15,
                            backgroundColor: 'gray',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: ScreenWidth,
                            height: 0.06 * ScreenHeight
                        }}>
                            <Text style={{fontSize: 17, color: 'black'}}>更新数据库</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.deleteDB();
                        }} style={{
                            marginTop: 15,
                            backgroundColor: 'gray',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: ScreenWidth,
                            height: 0.06 * ScreenHeight
                        }}>
                            <Text style={{fontSize: 17, color: 'black'}}>点击最后一条数据</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.deleteAllDB();
                        }} style={{
                            marginTop: 15,
                            backgroundColor: 'gray',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: ScreenWidth,
                            height: 0.06 * ScreenHeight
                        }}>
                            <Text style={{fontSize: 17, color: 'black'}}>点击删除所有</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.insertPerson();
                        }} style={{
                            marginTop: 15,
                            backgroundColor: 'gray',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: ScreenWidth,
                            height: 0.06 * ScreenHeight
                        }}>
                            <Text style={{fontSize: 17, color: 'black'}}>点击添加一个人进去</Text>
                        </TouchableOpacity>
                        <Text>{'当前版本:' + this.state.currentVersion + ' \n ' + JSON.stringify(this.state.allDatas)}</Text>
                    </View>
                </ScrollView>
            </View>
        );
    }

//新增一person且当前car表的所有数据都在这个person下
    insertPerson() {
        let cars = null;
        cars = SaveUtil.getInstance().getRealm().objects('Car');
        SaveUtil.getInstance().getRealm().write(() => {
            //     picture: 'string?'
            SaveUtil.getInstance().getRealm().create('Person', {
                name: '小名' + cars.length,
                birthday: cars.length + '',
                make: 'DXXX',
                cars: cars,
            });
            let persons = SaveUtil.getInstance().getRealm().objects('Person');
            this.setState((prevState) => ({allDatas: persons}), () => {
                console.log('数据' + persons[0].cars[0].miles);
                console.log(JSON.stringify(this.state.allDatas));
            })
        })
    }

    //打开、创建数据库
    openDB() {
        Realm.open({schema: [CarSchema, PersonSchema], schemaVersion: 0})
            .then(realm => {
                console.log('得到了realm对象');
                SaveUtil.getInstance().setRealm(realm);
                //打开后再获取下所有存储的数据
                this.getAllDB();
            })
            .catch(error => {
                Alert.alert('创建数据库失败:' + error)
                console.log(error);
            });
    }

//新增一条数据到数据库
    addDataToDB() {
        console.log("addDataToDB");
        let cars = SaveUtil.getInstance().getRealm().objects('Car');
        try {
            SaveUtil.getInstance().getRealm().write(() => {
                SaveUtil.getInstance().getRealm().create('Car', {
                    newData: 'newData',
                    id: cars.length,
                    make: 'DXXX',
                    model: 'model',
                    miles: cars.length,
                });
                this.getAllDB();
            })

        } catch (e) {
            console.log('插入数据出错' + e);
        } finally {

        }
    }


    //修改数据
    updateDB(id, model) {
        console.log("updateDB");
        //两种方式，一种是sql查询到需要操作的数据
        let car = SaveUtil.getInstance().getRealm().objects('Car').filtered('id = 0');
        console.log('找到这个id为0的是' + JSON.stringify(car));
        SaveUtil.getInstance().getRealm().write(() => {
            //必须使用write才能用
            console.log('实际操作的' + JSON.stringify(car) + '==' + model);
            car[0].model = model;
            this.getAllDB();
        });
//另一种是代码找到需要操作的数据
        // if (this.state.allDatas == null) {
        //     Alert.alert('数据库无数据!');
        //     return;
        // }
        // for (let i = 0; i < this.state.allDatas.length; i++) {
        //     if (this.state.allDatas[i].id == id) {
        //         SaveUtil.getInstance().getRealm().write(() => {
        //             //必须使用write才能用
        //             this.state.allDatas[i].model = model;
        //             this.getAllDB();
        //         });
        //
        //     }
        // }
    }


    //更新数据库版本
    updateDBVersion() {
        console.log("updateDBVersion");
        //设置新的存储结构，设置他的新版本号
        //注意 这个update必须是在数据库关闭的情况下调用，否则不能更新
        Realm.open({schema: [UpdateCarSchema, PersonSchema], schemaVersion: 1})
            .then(realm => {
                this.setState((prevState) => ({realm: realm}), () => {
                    this.getAllDB();
                })
            })
            .catch(error => {
                Alert.alert('更新数据库失败:' + error)
                console.log(error);
            });
    }

    //获取数据库的版本号
    getDBVersion() {
        console.log("getDBVersion");
        let currentVersion = Realm.schemaVersion(Realm.defaultPath);
        this.setState((prevState) => ({currentVersion: currentVersion}))
    }

    //查找所有的数据
    getAllDB() {
        console.log("getAllDB");
        let cars = null;
        cars = SaveUtil.getInstance().getRealm().objects('Car');
        this.setState((prevState) => ({allDatas: cars}), () => {

        })

    }

    //删除所有数据
    deleteAllDB() {
        let cars = null;
        cars = SaveUtil.getInstance().getRealm().objects('Car');
        SaveUtil.getInstance().getRealm().write(() => {
            SaveUtil.getInstance().getRealm().delete(cars);
            this.getAllDB();
        })

    }

//删除数据
    deleteDB() {
        let cars = null;
        cars = SaveUtil.getInstance().getRealm().objects('Car');
        SaveUtil.getInstance().getRealm().write(() => {
            SaveUtil.getInstance().getRealm().delete(cars[cars.length - 1]);
            this.getAllDB();
        })

    }

    componentWillMount() {
        this.openDB();
        this.getDBVersion();


    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
