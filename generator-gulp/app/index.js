var generators = require('yeoman-generator'),
    _ = require('yeoman-generator/node_modules/lodash'),
    glob = require('yeoman-generator/node_modules/glob'),
    chalk = require('yeoman-generator/node_modules/chalk'),
    log = console.log,
    fs = require('fs'),
    path = require('path'),
    del = require('del'),
    generatorName = 'gulp';

module.exports = generators.Base.extend({
    constructor: function(){
        generators.Base.apply(this, arguments);

        var dirs = glob.sync('+(src)');
        //now _.contains has been abandoned by lodash,use _.includes
        if(_.includes(dirs, 'src')){
            log(chalk.bold.green('资源已经初始化，退出...'));
            setTimeout(function(){
                process.exit(1);
            }, 200);
        }
    },
    prompting: function(){
        var questions = [
            {
                name: 'projectAssets',
                type: 'list',
                message: '请选择模板:',
                choices: [
                    {
                        name: '原生模板',
                        value: 'component',
                        checked: true
                    },{
                        name: 'JQ模板',
                        value: 'JQcomponent'
                    },{
                        name: 'require模板',
                        value: 'requireTpl'
                    }
                ]
            },
            {
                type: 'input',
                name: 'projectName',
                message: '输入项目名称',
                default: this.appname
            },
            {
                type: 'input',
                name: 'componentName',
                message: '输入插件名称',
                default: this.appname
            },
            {
                type: 'input',
                name: 'projectAuthor',
                message: '项目开发者',
                store: true,
                default: 'huangxiaoyan'
            },{
                type: 'input',
                name: 'projectVersion',
                message: '项目版本号',
                default: '0.0.1'
            }
        ]
        return this.prompt(questions).then(
            function(answers){
                for(var item in answers){
                    answers.hasOwnProperty(item) && (this[item] = answers[item]);
                }
            }.bind(this));
    },
    writing: function(){
        this.projectOutput = './dist';
        //拷贝文件
        this.directory(this.projectAssets,'src');
        this.copy('package.json', 'package.json');

        if(generatorName == 'requireTpl') {
            var source = fs.createReadStream('src/gulpfile.js');
            var desti = fs.createWriteStream('gulpfile.js');
            source.pipe(desti);

            source.on('end',function() {
                fs.unlink('src/gulpfile.js', function(err) {
                    if(err) throw err;
                });
                del(['src/gulpfile.js']);
            });

        }else {
            this.copy('gulpfile.js', 'gulpfile.js');
        }

        //模板
        this.fs.copyTpl(
            this.templatePath(this.projectAssets+'/js/index.js'),
            this.destinationPath('src/js/'+this.componentName+'.js'),
            {
                componentName: this.componentName
            }
        );
    },
    end: function(){
        del(['src/**/.gitignore','src/**/.npmignore','src/js/index.js']);
        var dirs = glob.sync('+(node_modules)');
        if(!_.includes(dirs, 'node_modules')){
            //创建软连接
            this.spawnCommand('ln', ['-s', '/usr/local/lib/node_modules/common-packages/'+generatorName+'/node_modules', 'node_modules']);
        }
    }
})