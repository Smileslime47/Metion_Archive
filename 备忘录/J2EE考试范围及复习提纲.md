# J2EE 考试范围及复习提纲

## 考试范围

范围：第一章到第十五章
小题以课堂练习的知识点为基础

### 小题x4

- 单选 1x20
- 多选 2x5
- 判断 1x10
- 填空 1x10

### 大题x2

名词解释 3x8
- 教材范围$1.2、2.1、2.3、3.4、3.5、4.2、4.3、5.2、6.2、6.4、7.4、7.5、8.1、9.1、11.4、12.1$

简答 26分4道
- 教材范围$1.3、2.3、7.2、8.4、11.3、12.1、13.3、15.1$

## Mybatis基础课堂练习(1-3章) 
1. [√]MyBatis框架是一种ORM框架，ORM框架即为对象关系映射框架。
2. [x]MyBatis映射文件中<mappers>元素是配置文件的根元素，它包含一个namespace属性，该属性为这个<mappers>指定了唯一的命名空间。
配置文件的根元素是<configuration>，映射文件的根元素是<mapper>
namespace字段是<mapper>的属性而不是<mappers>的
3. [x]SqlSession实例也是线程安全的，可以将其放在一个类的静态字段、实例字段或任何类型的管理范围(如Servlet的HttpSession)中使用。
SqlSession是线程不安全的，因此不能放在静态字段中
4. [√]MyBatis动态SQL中的<choose> ( <when>.、<otherwise>)元素类似Java中的switch...case...default语句，用于进行多条件分支判断。
5. 有关MyBatis工作原理说法错误的是
   - A.[√]MyBatis的全局配置文件配置了MyBatis的运行环境等信息，其中主要内容是获取数据库连接。
   - B.[√]MyBatis映射文件中配置了操作数据库的SQL语句，需要在MyBatis的全局配置文件中加载才能执行。
     - 映射文件指的是mapper.xml，需要在全局配置的<mappers>中注册
   - C.[x]可以通过MyBatis的环境等配置信息构建会话对象SqlSession。
     - 通过MyBatis的环境等配置信息构建SqlSessionFactory
   - D.[√]SqlSession对象，该对象中包含了执行SQL的所有方法。
6. 关于MyBatis模糊查询中进行SQL字符串拼接时，说法错误的是
   - A.[√]使用“$”进行SQL字符串拼接时，无法防止SQL注入问题。
     - #{}表示一个占位符，向占位符输入参数，MyBatis 会自动进行Java类型和jdbc类型的转换，且不需要考虑参数的类型，以预编译的方式传入，可以有效的防止 SQL注入，提高系统安全性。例如:传入字符串，MyBatis最终拼接好的SQL就是参数两边加单引号。
     - \$\{\}表示SQL的拼接，通过\$\[\}接收参数，将参数的内容不加任何修饰拼接在SQL中，以字符串替换方式\$\{\}替换成变量的值，可能存在SQL注入的安全隐患。在用于传入数据库对象，例如传入表名和列名，还有排序时使用order by动态参数时可以使用\$\[\}。
   - B.[√]可以使用MySQL中的concat()函数进行字符串拼接。
   - C.[x]使用MySQL中的concat()函数进行字符串拼接，也无法防止SQL注入。
     - Mybatis(重点)的xml中的concat函数可以防止SQL注入
   - D.[√]使用MySQL中的concat()函数进行字符串拼接，导致数据库移植性变差。
7. 以下有关<sql>元素说法错误的是
   - A.[√]<sql>元素的作用就是定义可重用的SQL代码片段，然后在其他语句中引用这—代码片段。
   - B.[√]使用<include>元素的refid属性可以引用自定义的代码片段。
     - 在查询语句的外侧定义sql，然后可以在查询语句内测通过include引用sql	
   - C.[x]使用<include>元素refid的属性值为自定义代码片段的name.
     - 属性值应当为自定义片段的id(见下例)
   - D.[√]<sql>元素是<mapper>元素的子元素。

**7例：**
```xml
<mapper>
    ...
    <sql id="ref">
        ${abc},name,authorId
    </sql>
    ...
    <select id="selectbyId" resultMap="BaseResultMap">
        select
        <include refid="ref">
            <property name="abc" value="bid"/>
        </include>
        from
        blog where bid = #{bid}
    </select>
</mapper>
```

8. 以下关于`<select>`元素及其属性说法错误的是
   - A.[√]`<select>`元素用来映射查询语句，它可以帮助我们从数据库中读取出数据，并组装数据给业务开发人员。
   - B.[√]parameterType属性表示传入SQL语句的参数类的全限定名或者别名。
   - C.[x]resultMap表示外部resultMap的命名引用，返回时可以同时使用resultType和resultMap。
     - 可以使用 resultType 或 resultMap，但不能同时使用。
     - resultTyoe是`<select>`的一个属性，即`<select resultType="...">`，而resultMap是`<select>`的一个子元素，即`<select><resultMap></resultMap></select>`
     - resultType用于返回数据的字段和POJO类的名称严格一一对应时，指明返回数据的POJO类型，不需要多余的属性
     - resultMap用于名称不严格一一对应时，还能在子元素中用<result>额外地指定POJO变量名和数据字段的绑定关系（如<result property="id" column="uid"></result>）	
   - D.[√]在同一个映射文件中可以配置多个`<select>`元素
9. 以下不属于<foreach>元素中使用的属性的是
   - A.[√]separator
     - 迭代后返回的元素之间的分隔符，默认是" , "
   - B.[√]collection
     - 进行迭代的集合对象
   - C.[x]current
   - D.[√]item
     - 必选，指明迭代时的别名(类似for(Obj item:list)中的item)
   - 除此之外还有open、close、index三个属性
10. 以下有关MyBatis动态SQL中的主要元素说法错误的是
    - A.[√]<if>用于单条件分支判断。
    - B.[√]<choose> ( <when>、<otherwise>)用于多条件分支判断。
    - C.[√]<foreach>循环语句，常用于in语句等列举条件中。
    - D.[x]<bind>从OGNL表达式中创建—个变量，并将其绑定到上下文，只于模糊查询的sql中。
      - 常用于模糊查询，但是大部分通用数据库的参数引用都可以用bind
      - 相比concat函数，bind会保证在不同数据库的兼容性问题（如Oracle），而concat函数只在MySQL中有效
      - 举例来说，MySQL中"IN A,B,C"的表达式，在Oracle中可能是“A || B || C”，而bind保证了不需要为每种数据库单独写一份映射文件

## 深入Mybatis课堂练习（4-5章）
1. [x]MyBatis是通过`<resultMap>`元素的`<collection>`子元素该元素来处理一对一关联关系的。
   - 见上第8题C，通过`<result>`子元素处理
2. [√]MyBatis在映射文件中加载关联关系对象主要通过两种方式:嵌套查询和嵌套结果。
   - 当一个POJO对象同时包含多个表的数据时可以用嵌套查询/嵌套结果获取数据
   - 嵌套查询：对多个表进行多次查询，再将查询结果合并出一个完整的POJO对象，优点是不需要写复杂的SELECT语句，缺点是多次表查询，效率低下
   - 嵌套结果：手写多表查询（JOIN），缺点就是写出来的SQL语句会很复杂，但是优点是只有一次查询，性能好

**2嵌套查询例：**
可以看到SELECT语句较简单，但是resultMap的<collection>子元素中指定了额外的select操作，当返回结果集时，对于每个集合中的元素都需要单独执行一次查询
```xml
<resultMap id="queryStudentAndCourseMap" type="student">
    <id property="stId" column="st_id"/>
    <result property="stName" column="st_name"/>
    <result property="stAge" column="st_age"/>
    <collection property="courseList" column="st_id" ofType="course" select="mybatis.mapper.CourseMapper.selectCourseByStId"/>
</resultMap>

<select id="queryStudentAndCourse" resultMap="queryStudentAndCourseMap">
    select
        st_id,
        st_name,
        st_age
    from student
    where st_id = #{stId}
</select>
```

**2嵌套结果例：**
可以看到resultMap中没有额外的查询操作，但是写出来的SELECT语句包含复杂的多表联立
```xml
<resultMap id="studentClassCourseMap" type="student">
    <result property="stName" column="st_name"/>
    <result property="stAge" column="st_age"/>
    <association property="aClass" column="c_id" javaType="class" resultMap="classMap"/>
    <collection property="courseList" column="c_id" resultMap="courseMap" ofType="course"/>
</resultMap>

<select id="queryStAndClassAndCourse" resultMap="studentClassCourseMap">
    select
        s.st_name,
        s.st_age,
        c.c_name,
        co.co_name
    from student s
    join class c on s.c_id = c.c_id
    join course co on s.st_id = co.st_id
    where s.st_id = #{stId}
</select>
```

3. [√]后端分页是指前端通过Ajax请求指定页码(pageNum）和每页大小(pageSize)，后端查询出当页的数据返回给前端。
4. [√]MyBatis的数据缓存分为会话和应用两个级别，即一级缓存和二级缓存。
5. 以下关于`<association>`元素中常用属性说法错误的是
   - association用于当表中含有另一个表的外键时，建立映射关系，比如说，当Student类中含有Teacher类时，除了要在resultMap中建立Student表和Student类的映射之外，还需要建立Teacher表和Teacher类的映射
   - A.[√]property指定映射到的实体类对象属性，与表字段——对应。
   - B.[√]column指定表中对应的字段。
   - C.[√]javaType指定映射到实体对象属性的类型。
   - D.[x]fetchType指定在关联查询时是否启用延迟加载，默认值为eager.
     - 默认值为lazy

**5例：**
```xml
<resultMap type="Student" id="studentResultMap">
    <id column="id" property="id"/>
    <result column="name" property="name"/>
    <result column="gender" property="gender" />
    <result column="major" property="major"/>
    <result column="grade" property=" grade" />

    <association property="supervisor" javaType="Teacher">
        <id property="id" column="t_id" />
        <result property="name" column="t_name" />
        <result property=" gender" column="t_gender" />
        <result property="researchArea" column=" research_area" />
    </association>
</resultMap>
```

6. 下面关于数据库中多表之间关联关系说法错误的是
   - A.[√]—对一关联关系可以在任意一方引入对方主键作为外键。
   - B.[x]一对多关联关系在“一”的一方，添加“多”的一方的主键作为外键。
     - 比如说一个工厂有很多产品的话，肯定不能在工厂里存储所有产品的主键啊...应该在产品上添加工厂的主键作为外键
   - C.[√]多对多关联关系会产生中间关系表，引入两张表的主键作为外键。
   - D.[√]多对多关联关系的两个表的主键成可以为联合主键或使用新的字段作为主键。
7. 下面关于`<collection>`元素的描述正确的是
   - collection加在resultMap定义的“一对多”中的“一”方，用于在查询“一”的数据时，返回所属的所有“多“的一方（比如查询工厂时，Factory类下还有个Products的List字段）
   - A.[√]MyBatis就是通过`<collection>`元素来处理一对多关联关系的。
   - B.[x]`<collection>`元素的属性与`<association>`元素完全相同。
     - association只能用于建立一对一的外键关系，而collection只能用于建立一对多的外键关系
   - C.[x]ofType属性与javaType属性对应，它用于指定实体对象中所有属性所包含的元素类型。
     - ofType指定的是”集合“中元素的类型，而非对象属性的类型
   - D.[x]`<collection>`元素只能使用嵌套查询方式。
     - 见2题，可用多表联立进行嵌套结果查询，Mybatis会自动处理结果
8. Mapper接口编程方式很简单，下面有关Mapper接口必须遵守的规范不包括的是
   - A.[√]Mapper接口名称和对应的Mapper.xml映射文件的名称必须一致。
   - B.[√]Mapper.xml中的namespace与Mapper接口的类路径相同。
     - namespace用于将该配置文件绑定到项目的Mapper接口中，应当填写接口的全限定名（类似这个Mapper本身的JavaType）
   - C.[x]Mapper接口中的方法名和Mapper.xml中定义的每个执行语句的name相同。
     - 应当和id相同，SELECT没有name属性
   - D.[√]Mapper接口方法的输出参数类型要和Mapper.xml中定义的resultType的类型要相同。
9. 下列关于MyBatis框架注解描述错误的是
   - A.[√]MyBatis的注解位于org.apache.ibatis.annotations包中
   - B.[√]@select、@insert、@update和@delete可以完成常见的CRUD(增删改查) SQL语句映射
   - C.[x]注解只能实现“一对一”与“一对多”的关联查询
     - not even a wrong，不关联查询直接跑简单查询也是可以的啊= =
   - D.[√]MyBatis框架可以使用@lnsertProvider、@UpdateProvider、@DeleteProvider和@SelectProvider等注解支持动态SQL
10. 下列关于MyBatis的缓存机制说法错误的是
    - A.[√]MyBatis提供了默认下基于Java HashMap的缓存实现，以及用于与osCache、Ehcache、 Hazelcast和Memcached连接的默认连器。
    - B.[√]—级缓存是Session会话级别的缓存，位于表示—次数据库会话级别的SqlSession对象之中，又被称之为本地缓存。
      - 一级缓存的作用域是对于SqlSession而言的，换句话说，对于同一个SqlSession，所有mapper都共享同一个缓存区域
    - C.[√]二级缓存是Application应用级别的缓存，它的生命周期很长，它的作用范围是整个Application应用。
      - 二级缓存的作用域也是对于mapper而言的，换句话说，对于同一个mapper的SQL语句，多个SqlSession是共享同一个缓存区域的
    - D.[x]一级缓存缓存的是结果对象，二级缓存缓存的是SQL语句。
      - 两种缓存的都是结果数据，缓存语句有什么用啊= =

## Spring基础课堂练习（6-8章）
1. [√]Spring是一个轻量级的开源框架，并具有简单、可测试和松耦合等特点。
   - 不能再对了
2. [x]依赖注入(DI)与控制反转(loC)的含义不同，描述的不是同一个概念。
   - 是同一个概念，IoC是最终目的，而DI是实现这个目的的途径（即通过依赖注入来达成控制反转的效果）
3. [√]当Bean的作用域为singleton时，Spring容器就只会存在一个共享的Bean实例，对该Bean的所有请求，容器只会返回同一个Bean实例。
   - 相对的，prototype则会对于每次请求都new出一个新的实例返回
4. [√]使用AspectJ实现AOP有两种方式:一种是基于XML的声明式AspectJ，另一种是基于注解的声明式AspectJ。

**4XML声明例：**
```xml
<bean id="myAspect" class="com.itheima.aspectj.xml.MyAspect" />
<aop:config>
    <!--1.配置切面 -->
    <aop:aspect  id="aspect"  ref="myAspect">
        <!--  2.配置切入点 -->
        <aop:pointcut expression="execution(* com.itheima.jdk.*.*(..))"  id="myPointCut" />
        <!-- 3.配置通知 -->
        <!-- 前置通知 -->
        <aop:before method="myBefore" pointcut-ref="myPointCut" />
        <!-- 后置通知 -->
        <aop:after-returning method="myAfterReturning"
                  pointcut-ref="myPointCut" returning="returnVal" />
        <!-- 环绕通知 -->
        <aop:around method="myAround" pointcut-ref="myPointCut" />
        <!-- 异常通知 -->
        <aop:after-throwing method="myAfterThrowing"
                  pointcut-ref="myPointCut" throwing="e" />
        <!-- 最终通知 -->
        <aop:after method="myAfter" pointcut-ref="myPointCut" />
    </aop:aspect>
</aop:config>
```

**4注解声明例：**
```java
@Component
@Aspect
public class AlphaAspect {
    //定义切入点表达式
    @Pointcut ( "execution(*com.nowcoder.community.service.*.*(..)) ".)//使用一个返回返回值为void、方法体为空的方法来命名切入点
    public void pointcut( ) {}

    //前置通知
    @Before( "pointcut() ")public void before() { ... }
    //最终通知
    @After( "pointcut() " )public void after() { ... }
    //后置通知
    @AfterReturning ( "pointcut( )" )public void afterRetuning( ) { ... }
    //异常通知
    @AfterThrowing( "pointcut() ")public void afterThrowing( ) { ... }
    //环绕通知
    @Around ( "pointcut() ")
    public object around(ProceedingJoinPoint joinPoint) throws Throwable {
        system.out.println( "around before" );
        object obj = joinPoint.proceed( );
        System.out.println( "around after" );
        return obj;
    }
}
```

5. Spring的核心容器是其他模块建立的基础，以下哪个不是该容器的组成模块
   - A.[√]Beans模块
   - B.[√]Core模块
   - C.[√]Context模块
   - D.[x]AOP模块
   - 除了A,B,C外，Core Container的另一个模块是SpEL，详见下图
  
![](https://docs.spring.io/spring-framework/docs/4.3.x/spring-framework-reference/html/images/spring-overview.png)





## 11.4简答题
1. 简述Spring MVC的工作流程
- 用户发送请求至前端控制器DispatcherServlet。
- DispatcherServlet收到请求调用HandlerMapping处理器映射器。
- 处理器映射器找到具体的处理器(可以根据xml配置、注解进行查找)，生成处理器对象及处理器拦截器(如果有则生成)一并返回给DispatcherServlet。
- DispatcherServlet调用HandlerAdapter处理器适配器。
- HandlerAdapter经过适配调用具体的处理器(Controller，也叫后端控制器)。
- Controller执行完成返回ModelAndView。
- HandlerAdapter将controller执行结果ModelAndView返回给DispatcherServlet。
- DispatcherServlet将ModelAndView传给ViewReslover视图解析器。
- ViewReslover解析后返回具体View。
- DispatcherServlet根据View进行渲染视图（即将模型数据填充至视图中）。
- DispatcherServlet响应用户

