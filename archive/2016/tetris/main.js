;(function() {
    'use strict';
    //旋转检测

    //默认有五种方块模式，每个模式下含有不同的形状。每次随机选择一个模式，然后默认选择该模式下第一个形状
    //图形应完整出现
    //图形绘制时相对中心点来绘制
    //如果检测到周围有重叠方块则不能变形
    //变形时采用更换当前图形数组指针的策略而不新建图形对象
    var mode = [
        [
            [ [-1, 0], [0, 0], [1, 0], [2, 0] ],
            [ [0, 0], [0, 1], [0, 2], [0, 3] ]
        ],
        [
            [ [0, 0], [0, 1], [1, 1], [-1, 1] ],
            [ [0, 0], [0, 1], [0, 2], [1, 1] ],
            [ [-1, 0], [0, 0], [1, 0], [0, 1] ],
            [ [0, 0], [-1, 1], [0, 1], [0, 2] ]
        ],
        [
            [ [0, 0], [0, 1], [1, 0], [1, 1] ]
        ],
        [
            [ [0, 0], [0, 1], [1, 1], [1, 2] ],
            [ [0, 1], [1, 0], [1, 1], [2, 0] ]
        ],
        [
            [ [1, 0], [0, 1], [1, 1], [0, 2] ],
            [ [0, 0], [1, 0], [1, 1], [2, 1] ]
        ]
    ];

    var config = {
        width: 10,
        height: 15,
        figure_collection: mode,
        drawRegion: document.getElementById('region'),
        eleSize: 20,
        forecolor: '#333',
        backcolor: '#eee',
        interval: 1000,
        char: '+'
    }


    function Data( config ) { // 数据处理层
        this.width = config.width;
        this.height = config.height;
        this.figure_c = config.figure_collection;

        this.area = [];

        this.mode = null;
        this.figure = null;
        this.coord= null; 
        this.buffer = null;

        this.initArea();
        this.createFigure();
    }
    Data.prototype = {
        constructor: Data,

        initArea: function() { // 初始化area
            for( var i = 0; i < this.height; i++ ) {
                this.area[i] = new Array();
                for( var j = 0; j < this.width; j++ )
                    this.area[i][j] = 0;
            }
        },

        createFigure: function() { // 创建新图形，初始化中心坐标至(width/2-1, 0)
            this.coord = [ ( this.width >> 1 ) - 1, 0 ];
            this.mode = Math.floor( Math.random() * this.figure_c.length );
            this.figure = new Figure( this.figure_c[ this.mode ] );
        },

        changeCoord: function( num, mode ) { // 改变中心坐标，如果不传mode或mode和num，则默认向垂直方向加一
            num = num || 1;
            mode = mode || 0;

            if( this.checkVOverlap() ) {
                this.record();
                this.createFigure();
            } else if( ! this.checkHOverlap( ( num & mode )*num ) ) {
                if( mode )
                    this.coord[0] += num;
                else
                    this.coord[1] += num;
            }
        },

        checkHOverlap: function( direction ) { // 检查图形与堆叠区是否有水平方向的重叠或触边，如果有，返回true，否则返回false
            var a = this.figure;
            var x, y, i;
            for( i = 0; i < a.data.length; i++ ){
                x = a.data[i][0] + this.coord[0] + direction;
                y = a.data[i][1] + this.coord[1];
                if( ( x < 0 ) || ( x  == this.width )|| this.area[y][x] ) 
                    return true;
            }
            return false;
        },

        checkVOverlap: function() { // 检查图形与堆叠区是否有垂直方向的重叠或触底，如果有，返回true，否则返回false
            var a = this.figure;
            var x, y, i;
            for( i = 0; i < a.data.length; i++ ){
                x = a.data[i][0] + this.coord[0];
                y = a.data[i][1] + this.coord[1] + 1;
                if( ( y == this.height ) || this.area[y][x] ) 
                    return true;
            }
            return false;
        },

        //saveOldCoord: function() {
        //    this.buffer = new Array();
        //    this.buffer.push( this.coord[0], this.coord[1] );
        //},

        //recoveryCoord: function() {
        //    this.coord = this.buffer;
        //},

        record: function() { // 将图形记录进堆叠区
            this.figure.data.forEach( function( v ) {
                this.area[ this.coord[1] + v[1] ][ this.coord[0] + v[0] ] = 1;
            }.bind(this) );
        },

        clearFull: function() { // 清除满行
            var i, j, x = 0;

            for( i = this.height-1; i >= 0; i-- ) {
                for( j = 0; j < this.width; j++ )
                    if( ! this.area[i][j] )
                        break;
                if( j == this.width ) {
                    this.area.splice( i, 1 );
                    x++;
                }
            }
            if( x )
                this.addBlankRows( x );
        },

        addBlankRows: function( num ) { // 添加若干空行至area首
            var i, j;
            var buffer = [];
            for( i = 0; i < num; i++  ) {
                buffer[i] = new Array();
               for( j = 0; j < this.width; j++ ) 
                   buffer[i][j] = 0;
            }
            this.area = buffer.concat( this.area );
        },

        gameover: function() { // 判负
            var a = this.figure;
            var x, i;
            for( i = 0; i < a.data.length; i++ ){
                x = a.data[i][0] + this.coord[0];
                if( this.area[1][x] ) 
                    return true;
            }
            return false;
        }

    }


    function Figure( figure_c ) { // 图形对象
        this.figure_c = figure_c;
        this.data = figure_c[0]; //[ [x1, y1], [x2, y2], ... ]
        this.mode = 0;
    }
    Figure.prototype = {
        constructor: Figure,

        changeFigure: function() { // 旋转图形
            ( this.mode == this.figure_c.length-1 ) ? this.mode = 0 : this.mode++;
            this.data = this.figure_c[ this.mode ];
        }
    }


    function View( config, control ) { // 视图层
        this.region = config.drawRegion;
        this.ctx = config.drawRegion.getContext('2d');

        this.eleSize = config.eleSize;
        this.width = config.width;
        this.height = config.height;

        this.forecolor = config.forecolor;
        this.backcolor = config.backcolor;
        this.char = config.char;

        this.d = control;

        this.regionInit();
        this.drawBg();
    }
    View.prototype = {
        constructor: View,

        regionInit: function() { // 初始化画布
            this.region.width = this.width * this.eleSize;
            this.region.height = this.height * this.eleSize;
            this.ctx.font = this.eleSize + 'px Monospace';
            this.ctx.textBaseline = 'top';
        },

        drawBg: function() { // 绘制背景
            var i, j,
                size = this.eleSize;
            this.ctx.fillStyle = this.backcolor;

            for( i = 0; i < this.height; i++ )
                for( j = 0; j < this.width; j++ )
                    this.ctx.fillText( this.char, j*size, i*size );
        },

        drawAccu: function() { // 绘制堆积区域
            var area = this.d.area,
                i, j,
                size = this.eleSize;
            this.ctx.fillStyle = this.forecolor;

            for( i = 0; i < this.height; i++ )
                for( j = 0; j < this.width; j++ )
                    if( area[i][j] )
                        this.ctx.fillText( this.char, j*size, i*size );
        },

        drawFigure: function() { // 绘制降落图形
            var i, j, x, y,
                size = this.eleSize,
                f_data = this.d.figure.data,
                coord = this.d.coord;
            this.ctx.fillStyle = this.forecolor;

            for( i = 0; i < f_data.length; i++ ) {
                x = ( coord[0] + f_data[i][0] ) * size;
                y = ( coord[1] + f_data[i][1] ) * size;
                this.ctx.fillText( this.char, x, y );
            }
        },

        refresh: function() { // 刷新视图
            this.drawBg();
            this.drawFigure();
            this.drawAccu();

        },

        clearCtx: function() { // 清理画布
            this.ctx.clearRect( 0, 0, this.region.width, this.region.height );
        },

        drawFinishImg: function( num ) { // 游戏结束，绘制结束图像
            var k = num || 0;

            if( k == this.height + 1 ) {
                var size = this.eleSize;
                var x = ( this.width >> 1 )*size,
                    y = ( this.height >> 1 )*size;
                this.drawWords( 'GAME OVER', x, y );
                return;
            }

            setTimeout( function() {
                var size = this.eleSize;

                for( var i = 0; i < k; i++ )
                    for( var j = 0; j < this.width; j++ )
                        this.ctx.fillText( this.char, j*size, i*size );

                this.drawFinishImg( ++i );
            }.bind(this), 200 )
        },

        drawWords: function( str, x, y ) { // 绘制文字
                var size = this.eleSize;
                var w = size * ( str.length * 0.7 ),
                    h = size * 1.2;

                this.ctx.textAlign = 'center';
                this.ctx.fillRect( x-w/2, y, w, h );
                this.ctx.fillStyle = '#fff';
                this.ctx.fillText( str, x, y );

                this.ctx.fillStyle = this.forecolor;
                this.ctx.textAlign = 'left';
        },
    }


    function Tetris( config ) { // 控制层
        this.d = new Data( config ),
        this.v = new View( config, this.d );

        this.interval = config.interval;

        this.start();
    }
    Tetris.prototype = {
        constructor: Tetris,

        launch: function() { // 工作定时器
            if( this.d.gameover() ) {
                this.finish();
                return;
            } 
            this.v.refresh();
            setTimeout( function() {
                this.d.changeCoord();
                this.d.clearFull();
                this.v.refresh();

                this.launch();
            }.bind(this), this.interval );
        },

        start: function() { // 开始游戏
            this.bindKeyboard( this.keyboardAction.inGame.bind(this) );
            this.v.clearCtx();
            this.d.createFigure();
            this.launch();
        },

        finish: function() { // 结束游戏
            this.v.drawFinishImg();
            this.d.initArea();
            this.bindKeyboard( this.keyboardAction.outGame.bind(this) );
        },

        bindKeyboard: function( fun ) { // 绑定键盘事件
            document.onkeydown = fun;
        },

        keyboardAction: { // 键盘动作集合
            inGame: function( e ) { // 在游戏中
                var keycode = e.which;
                var i, j;
                
                switch( keycode ) {
                    case 37: // <-
                        this.transFigure( -1, 1 ); break;
                    case 39: // ->
                        this.transFigure( 1, 1 ); break;
                    case 40: // v
                        this.transFigure( 1, 0 ); break;
                    case 38: // ^
                        this.d.figure.changeFigure(); this.v.refresh(); break;
                }
            },

            outGame: function( e ) { // 游戏结束后
                switch( e.which ) {
                    case 32: // space
                        this.start(); break;
                }
            }
        },

        transFigure: function( num, mode ) { // 平移图形
            this.d.changeCoord( num, mode );
            this.v.refresh();
        },
    }

    new Tetris( config );
})()
