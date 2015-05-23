# Xinting's JSON format data fill structure #
本js将json结构数据填充进html模版中

在html元素中添加data-with属性，格式为data-with="方法:值或变量"

## 基础方法 ##
text: value 填充data.value到text
val: value 填充data.value到val
src: value 填充data.value到src
href: value 填充data.value到href，a有效
    data:
        {...,
        name: 'with',
        ...}
    html中:
        <p data-with="text: name"></p>
    结果：
        <p data-with="text: name">with</p>

## 通用属性填充 ##
attr: key,value 填充data.value到key属性中
    data:
        {...,
        link: 'http://example.com',
        ...}
    html中:
        <a data-with="attr: href,link"></a>
    结果：
        <a href="http://example.com" data-with="attr: href,link"></a>
			
## 列表循环填充 ##
list: values 将data.values填充到以example为标准的节点中并添加到子节点
(data.values必须是一个列表,子节点中必须有example)
list 方法中有一个系统变量，loop，表示当前的循环次数，从0开始
    data: 
        {...,
        users: [
            {
                name: 'user1',
                age: 'age1'
            },{
                name: 'user2',
                age: 'age2'
            }
        ],
        ...}
    html:
        <ul data-with="list: users">
            <example>
                <li>
                    <p data-with="text: name"></p>
                    <p data-with="text: age"></p>
                    <p data-with="text: loop"></p>
                </li>
            </example>
        </ul>
    result:
        <ul data-with="list: users">
            <example>
                <li>
                    <p data-with="text: name"></p>
                    <p data-with="text: age"></p>
                </li>
            </example>
            <li>
                <p data-with="text: name">user1</p>
                <p data-with="text: age">age1</p>
                    <p data-with="text: loop">0</p>
            </li>
            <li>
                <p data-with="text: name">user2</p>
                <p data-with="text: age">age2</p>
                <p data-with="text: loop">1</p>
            </li>
        </ul>

## 字典填充 ##
fill: value 将data.value填充到子节点中
    data: 
        {...,
        book: {
            name: 'book1',
            author: 'author1'
        },
        ...}
    html:
        <div data-with="fill: book">
            <p data-with="text: name"></p>
            <p data-with="text: author"></p>
        </div>
    result:
        <div data-with="fill: book">
            <p data-with="text: name">book1</p>
            <p data-with="text: author">author1</p>
        </div>
## 条件填充 ##
bool: value?(expr1)(expr2) 判断data.value是否存在或是否为真，是则执行expr1，否则执行expr2
    data:
        {...,
        in: true,
        ...}
    html:
        <p data-with="bool: in?(show)(hide)"></p>
    result:
        该节点会隐藏
        
## 节点操作 ##
通常与条件填充配合使用
show
hide
remove
    
## 附注 ##
如果只有方法，没有值，则填充data本身
data: 'text'
html: <p data-with="text"></p>
result: <p data-with="text">text</p>
	
值可以是简单的表达式
    data: 
        {...,
        id: 1,
        name: 'name1',
        ...}
    html:
        <p data-with="attr: id,'#'-id-name"></p>
    result:
        <p data-with="attr: id,'#'-id-name" id="#1name1></p>