BEGIN{
suffix="tst"
}
{
    print $1+"cal";
}
END{
    print "ok"
}