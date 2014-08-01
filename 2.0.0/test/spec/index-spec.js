KISSY.add(function (S, Node,Demo) {
    var $ = Node.all;
    describe('wake-up-app', function () {
        it('Instantiation of components',function(){
            var demo = new Demo();
            expect(S.isObject(demo)).toBe(true);
        })
    });

},{requires:['node','gallery/wake-up-app/1.0.0/']});