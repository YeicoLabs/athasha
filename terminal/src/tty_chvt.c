#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <stddef.h>
#include <unistd.h>
#include <fcntl.h>
#include <string.h>
#include <termios.h>
#include <signal.h>
#include <pthread.h>
#include <sys/ioctl.h>
#include <sys/select.h>
#include <sys/types.h>
#include <sys/stat.h>
#ifdef __linux__
#include <linux/vt.h>
#include <linux/kd.h>
#endif

#define UNUSED(x) (void)(x)

int main(int argc, char *argv[]) {
#ifdef __linux__
  if (argc < 2) crash("argc %d", argc);
  int tn = atoi(argv[1]);
  int fd = open("/dev/tty0", O_RDWR);
  if (fd < 0) crash("open /dev/tty0");
  if (ioctl(fd, VT_ACTIVATE, tn)) crash("chvt VT_ACTIVATE");
  if (ioctl(fd, VT_WAITACTIVE, tn)) crash("chvt VT_WAITACTIVE");
  close(fd);
#else
  UNUSED(argc);
  UNUSED(argv);
#endif
  return 0;
}
