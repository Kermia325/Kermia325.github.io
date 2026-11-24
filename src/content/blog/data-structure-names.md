---
title: '栈为什么叫栈？聊聊数据结构里几个奇怪的名字'
description: '栈不是客栈，度也不一定在量角度。从叠盘子到数树枝，聊聊这些名字能告诉我们什么，以及哪些命名故事还不能当真。'
pubDate: '2026-11-24'
published: true
---

学数据结构，有时最先把人拦住的不是代码，而是名字。

“链表”还算直白，“栈”却容易让人想到客栈；刚接受树也有“度”，到了图那里，计数规则又变了。同一个字，怎么还带换工作岗位的？

作为一个还在学数据结构的大二学生，我想顺着这些疑问查一查：它们本来是什么意思，又怎样和结构联系起来。先说好，词义讲得通，不等于命名历史就被我们破案了。

## 栈：英文像一摞盘子，中文却像一家客栈

英文 **stack** 没有中文“栈”那么陌生。它的一个日常意思，就是东西一件叠在另一件上面形成的一摞，比如盘子、书或纸。[Cambridge Dictionary：stack](https://dictionary.cambridge.org/dictionary/english/stack?topic=masses-and-large-amounts-of-things)

想象一摞盘子，我们约定只能从最上面放、从最上面拿。先放 A，再放 B，最后放 C，那么拿出来的顺序就是 C、B、A。

```text
        放入 / 取出
             ↕
          [ C ] ← 栈顶
          [ B ]
          [ A ]
```

这就是“后进先出”。栈的关键不是长得高高的，而是新增和删除都被限制在同一端：栈顶。放进去叫入栈，取出来叫出栈；画成横着的一排也完全可以，规则不会因此失效。[NIST：Stack](https://xlinux.nist.gov/dads/HTML/stack.html)

当然，现实里你硬要抽走中间那个盘子，也不是绝对做不到，只是可能要负责收拾现场。数据结构里的栈则直接不提供这种操作。类比负责帮忙想象，约定才负责把概念说准确。

那中文为什么选“栈”？

“栈”不是为了计算机新造的字。《重编国语辞典修订本》的“棧”条目列有客栈、货栈等用法；其中“货栈”就是囤积货物的仓库。把它和存放东西联系起来，有词义上的依据。[“棧”](https://dict.revised.moe.edu.tw/dictView.jsp?ID=7822&la=0&powerMode=0)、[“貨棧”](https://dict.revised.moe.edu.tw/dictView.jsp?ID=84500&la=0&powerMode=0)

但仓库并不天然后进先出，客栈更不会规定最后入住的人必须先退房。这些旧词义，并不能直接推出计算机里的操作规则。

所以，目前能说清的是：英文 stack 的“一摞”很适合帮助理解这种结构；中文“栈”也有存放场所相关的用法。至于最早是谁选择了这个译字、当时究竟考虑了什么，我查到的资料不足以确认。把“货物堆叠”当记忆线索可以，把它写成译名诞生的真实故事，就走得太远了。

## 度：先别拿量角器，先问“数什么”

**degree** 并不只表示角度。日常英语里，它也表示某种事物的程度或数量水平。因此，把这里的“度”理解为衡量连接数量的一个指标，比想到三十度、六十度更贴切。不过，这仍是词义上的理解，不是对历史命名动机的证明。[Cambridge Dictionary：degree](https://dictionary.cambridge.org/dictionary/english/degree)

真正容易混的地方，是“连接数量”还得具体问：到底数哪些连接？

先看数据结构课里常见的有根树，指定 A 为根：

```text
        A
       / \
      B   C
     / \
    D   E
```

在这个语境里，结点的度数的是**孩子数量**。A 有 B、C 两个孩子，度为 2；B 有 D、E 两个孩子，度也是 2；C、D、E 没有孩子，度为 0。B 虽然还连着父结点 A，但这条关系不计入它的孩子数。[Cornell：Trees](https://www.cs.cornell.edu/courses/cs312/2004fa/lectures/lecture10.htm)

换到无向图，规则不同了。先看一张没有自环、没有重复边的小图：

```text
    A —— B —— D
     \  /
      C
```

B 连着 A、C、D，度为 3；A、C 各为 2，D 为 1。这里不分父母和孩子，只数关联到顶点的边；更严谨地说，是数接在这个顶点上的边端。[Cornell：Graphs](https://www.cs.cornell.edu/courses/cs2800/2017sp/lectures/lec35-graphs.html)

现在回头看刚才那棵树：如果把它当无向图，B 的度就是 3，因为 AB、BD、BE 都要算；D 的度也从“孩子数为 0”，变成了“关联一条边，为 1”。图没变，问题换了。

这不是树和图互相矛盾，而是同一个“度”采用了不同约定。NIST 的术语词典也把图顶点的度和树结点的孩子数分成不同义项。看到“度”，最好顺手确认一下所在语境。[NIST：Degree](https://xlinux.nist.gov/dads/HTML/degree.html)

如果边有方向，就再分开数：

```text
    A → B ← C
        ↓
        D
```

对 B 而言，两条箭头指进来，入度为 2；一条箭头指出去，出度为 1。可以暂时想成收到了两封信、寄出了一封信，但数的是边，不是不同收件人的人数。

还有个小补丁：如果允许自环，无向图里一条从自己连回自己的边会贡献 2，因为两个边端都落在这里；有向图的自环则给入度、出度各加 1。若允许平行边，也要分别计数。所以“认识几个邻居”只在没有这些特殊情况时才够用。[Cornell：Graphs](https://www.cs.cornell.edu/courses/cs2800/2017sp/lectures/lec35-graphs.html)

## 堆：名字很随便，内部却有规矩

既然 stack 是一摞，那 **heap** 又是什么？日常英语里，heap 可以指杂乱堆积的一堆东西。两个词确实有语义重叠，不能指望词典替我们完成数据结构分类。[Cambridge 词典样页：heap](https://assets.cambridge.org/97805218/58045/frontmatter/9780521858045_frontmatter.pdf)

有趣的是，数据结构里的堆并不乱。拿常见的**二叉最大堆**来说，每个父结点的值都不小于孩子，形状还要满足完全二叉树的要求：上面各层填满，最后一层从左往右排。[NIST：Binary Heap](https://xlinux.nist.gov/dads/HTML/binaryheap.html)

```text
       10
      /  \
     7    9
```

这就是一个合法的小例子。10 在顶上，7 和 9 谁在左边都不违反父子之间的大小规则。它没有承诺把所有元素从左到右排好，只保证沿着父子关系往下走，不会遇到比父亲更大的值。

所以，“一堆东西里，把最大的顶到上面”是个好记的画面；但它只是记忆办法，不是我查证过的命名现场。也别把上述形状规则推广到所有堆：这里说的是二叉堆。

## 链表：链条不是画在纸上的，是存在数据里的

“链表”大概是这几个名字里最愿意配合初学者的一个。英文 **linked list**，就是连接起来的列表。

想象几张卡片，彼此不必挨着放，但每张除了写自己的内容，还记着“下一张在哪里”。拿到第一张，就能沿着线索继续找。

```text
    [A | 下一项] → [B | 下一项] → [C | 空]
```

以单链表为例，每个结点保存数据以及通往下一结点的链接，代码里通常表现为指针或引用。这里的箭头不是装饰，它对应着真实保存的连接信息。[NIST：Linked List](https://xlinux.nist.gov/dads/HTML/linkedList.html)

名字里的“表”说的是逻辑上的先后顺序，“链”说的是怎样把顺序接起来。A、B、C 在内存里不必住隔壁，也能依次找到彼此。理解这一点，再看纸上那串方框，就不会误以为它们必须整整齐齐地排在连续地址里。

## 名字终于没那么陌生了

查完这些，我觉得最有意思的不是每个名字都有传奇来历，而是有的名字很直观，有的名字必须带上语境，还有的译名历史暂时只能留个问号。

至少下次碰到栈，可以先想盘子；碰到度，可以先问数什么。至于“栈为什么不是叫摞”，这个疑问依然合理，只是暂时不用靠编一个古代仓库的故事来回答。

## 参考资料

- Cambridge Dictionary：[stack](https://dictionary.cambridge.org/dictionary/english/stack?topic=masses-and-large-amounts-of-things)、[degree](https://dictionary.cambridge.org/dictionary/english/degree)、[含 heap 词条的词典样页](https://assets.cambridge.org/97805218/58045/frontmatter/9780521858045_frontmatter.pdf)。
- 教育部《重编国语辞典修订本》：[棧](https://dict.revised.moe.edu.tw/dictView.jsp?ID=7822&la=0&powerMode=0)、[貨棧](https://dict.revised.moe.edu.tw/dictView.jsp?ID=84500&la=0&powerMode=0)。
- NIST《Dictionary of Algorithms and Data Structures》：[Stack](https://xlinux.nist.gov/dads/HTML/stack.html)、[Degree](https://xlinux.nist.gov/dads/HTML/degree.html)、[Binary Heap](https://xlinux.nist.gov/dads/HTML/binaryheap.html)、[Linked List](https://xlinux.nist.gov/dads/HTML/linkedList.html)。
- Cornell 课程资料：[Trees](https://www.cs.cornell.edu/courses/cs312/2004fa/lectures/lecture10.htm)、[Graphs](https://www.cs.cornell.edu/courses/cs2800/2017sp/lectures/lec35-graphs.html)。
